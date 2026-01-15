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
    this.#cache = new LRU(cacheOptions);
  }

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

  async #withTransaction(fn) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }


  async findById(id, select = []) {
    this._validateId(id);
    const idString = id.toString();

    const key = this.#getCacheKey('findById', { id: idString, select });
    const cached = this.#cache.get(key);
    if (cached !== undefined) return cached;

    let query = this.model.findById(idString);
    const projection = this._selectProjection(select);
    if (projection) query = query.select(projection);

    const result = await query.lean();
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

    this.model.schema.eachPath((path, schemaType) => {
      if (schemaType.options?.ref) query.populate(path);
    });

    const result = await query.lean();
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

    const result = await query.lean();
    this.#cache.set(key, result || null);

    return result || null;
  }

  async create(data) {
    return this.#withTransaction(async (session) => {
      const created = (
        await this.model.create([data], { session })
      )[0].toObject();

      const key = this.#getCacheKey('findById', {
        id: created._id.toString(),
        select: this.#selectList
      });

      this.#cache.set(key, created);
      this.#deleteListCaches();

      return created;
    });
  }

  async save(entity, select = []) {
    const id = entity._id || entity.id;
    this._validateId(id);
    const idString = id.toString();

    return this.#withTransaction(async (session) => {
      let query = this.model.findByIdAndUpdate(
        idString,
        entity,
        { new: true, session }
      );

      const projection = this._selectProjection(select);
      if (projection) query = query.select(projection);

      const updated = await query.lean();

      const key = this.#getCacheKey('findById', {
        id: idString,
        select: this.#selectList
      });

      this.#cache.set(key, updated || null);
      this.#deleteListCaches();

      return updated || null;
    });
  }

  async directUpdate(id, fields, select = []) {
    this._validateId(id);
    const idString = id.toString();

    return this.#withTransaction(async (session) => {
      let query = this.model.findByIdAndUpdate(
        idString,
        fields,
        { new: true, session }
      );

      const projection = this._selectProjection(select);
      if (projection) query = query.select(projection);

      const updated = await query.lean();

      const key = this.#getCacheKey('findById', {
        id: idString,
        select: this.#selectList
      });

      this.#cache.set(key, updated || null);
      this.#deleteListCaches();

      return updated || null;
    });
  }

  async deleteOne(filter) {
    return this.#withTransaction(async (session) => {
      const deleted = await this.model
        .findOneAndDelete(filter)
        .session(session);

      if (!deleted) return null;

      const key = this.#getCacheKey('findById', {
        id: deleted._id.toString(),
        select: this.#selectList
      });

      this.#cache.set(key, null);
      this.#deleteListCaches();

      return deleted;
    });
  }

  async deleteMany(filter) {
    return this.#withTransaction(async (session) => {
      await this.model.deleteMany(filter).session(session);
      this.#invalidateCache();
      return null;
    });
  }

  async deleteById(id) {
    this._validateId(id);
    const idString = id.toString();

    return this.#withTransaction(async (session) => {
      const deleted = await this.model
        .findByIdAndDelete(idString)
        .session(session);

      const key = this.#getCacheKey('findById', {
        id: idString,
        select: this.#selectList
      });

      this.#cache.set(key, null);
      this.#deleteListCaches();

      return deleted || null;
    });
  }
}

module.exports = BaseRepository;
