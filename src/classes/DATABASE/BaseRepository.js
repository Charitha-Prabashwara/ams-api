const mongoose = require('mongoose');
const { InvalidUserIdError } = require('../../errors');
const LRU = require('lru-cache');

class BaseRepository {
  model;
  #selectList;
  #cache;

  constructor(model, select = [], cacheOptions = { max: 40000, ttl: 1000 * 60 * 60 }) {
    this.model = model;
    this.#selectList = select;
    this.#cache = new LRU(cacheOptions); // LRU v7+
  }

  /* -------------------- helpers -------------------- */

  _validateId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new InvalidUserIdError();
    }
  }

  _selectProjection(select = []) {
    const fields = select.length ? select : this.#selectList;
    return fields.length ? fields.join(' ') : undefined;
  }

  #getCacheKey(method, args) {
    return `${method}:${JSON.stringify(args)}`;
  }

  #invalidateCache() {
    this.#cache.clear();
  }

  #deleteListCaches() {
    for (const k of this.#cache.keys()) {
      if (k.startsWith('find:') || k.startsWith('findOne:')) {
        this.#cache.delete(k);
      }
    }
  }

  /* -------------------- READS (cached) -------------------- */

  async findById(id, select = []) {
    this._validateId(id);
    const idString = id.toString();

    const key = this.#getCacheKey('findById', { id: idString, select });
    const cached = this.#cache.get(key);
    if (cached !== undefined) return cached;

    let query = this.model.findById(idString);
    const projection = this._selectProjection(select);
    if (projection) query = query.select(projection);
    query = query.lean();

    const result = await query;
    this.#cache.set(key, result || null);
    return result || null;
  }

  async find(filter = {}, options = {}) {
    const key = this.#getCacheKey('find', { filter, options });
    const cached = this.#cache.get(key);
    if (cached !== undefined) return cached;

    const { limit, skip = 0, select, sort } = options;
    let query = this.model.find(filter).skip(skip);

    if (limit) query = query.limit(limit);
    if (sort) query = query.sort(sort);

    const projection = this._selectProjection(select || []);
    if (projection) query = query.select(projection);

    // Auto-populate references
    this.model.schema.eachPath((path, schemaType) => {
      if (schemaType.options?.ref) query.populate(path);
    });

    query = query.lean();

    const result = await query;
    this.#cache.set(key, result || []);
    return result || [];
  }

  async findOne(filter = {}, options = {}) {
    const key = this.#getCacheKey('findOne', { filter, options });
    const cached = this.#cache.get(key);
    if (cached !== undefined) return cached;

    const { skip = 0, select = [], sort } = options;
    let query = this.model.findOne(filter).skip(skip);

    if (sort) query = query.sort(sort);

    const projection = this._selectProjection(select);
    if (projection) query = query.select(projection);

    query = query.lean();

    const result = await query;
    this.#cache.set(key, result || null);
    return result || null;
  }

  /* -------------------- WRITES -------------------- */

  async create(data) {
    const created = (await this.model.create(data)).toObject();

    // Cache for findById immediately
    const select = this.#selectList;
    const key = this.#getCacheKey('findById', { id: created._id.toString(), select });
    this.#cache.set(key, created);

    // Clear other list caches
    this.#deleteListCaches();

    return created;
  }

  async save(entity, select = []) {
    const id = entity._id || entity.id;
    this._validateId(id);
    const idString = id.toString();

    let query = this.model.findByIdAndUpdate(idString, entity, { new: true });
    const projection = this._selectProjection(select);
    if (projection) query = query.select(projection);

    query = query.lean();
    const updated = await query;

    // Update cache for this ID
    const key = this.#getCacheKey('findById', { id: idString, select: this.#selectList });
    this.#cache.set(key, updated || null);

    // Clear list caches
    this.#deleteListCaches();

    return updated || null;
  }

  async directUpdate(id, fields, select = []) {
    this._validateId(id);
    const idString = id.toString();

    let query = this.model.findByIdAndUpdate(idString, fields, { new: true });
    const projection = this._selectProjection(select);
    if (projection) query = query.select(projection);

    query = query.lean();
    const updated = await query;

    // Update cache for this ID
    const key = this.#getCacheKey('findById', { id: idString, select: this.#selectList });
    this.#cache.set(key, updated || null);

    // Clear list caches
    this.#deleteListCaches();

    return updated || null;
  }

  async deleteOne(filter) {
    const deleted = await this.model.findOneAndDelete(filter);

    if (!deleted) return null;

    const idString = deleted._id.toString();
    const key = this.#getCacheKey('findById', { id: idString, select: this.#selectList });
    this.#cache.set(key, null);

    this.#deleteListCaches();

    return deleted || null;
  }

  async deleteMany(filter) {
    await this.model.deleteMany(filter);

    this.#invalidateCache(); // clear everything

    return null;
  }

   async deleteById(id) {
    this._validateId(id);
    const idString = id.toString();

    const deleted = await this.model.findByIdAndDelete(idString);

    const key = this.#getCacheKey('findById', { id: idString, select: this.#selectList });
    this.#cache.set(key, null);

    this.#deleteListCaches();

    return deleted || null;
  }
}

module.exports = BaseRepository;
