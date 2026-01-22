const { default: mongoose, MongooseError } = require('mongoose');
const { UserNotFoundError, InvalidUserIdError } = require('../../errors');

class BaseRepository {
  model;
  #selectList;
  constructor(model, select = []) {
    this.model = model;
    this.#selectList = select;
  }

  _validateId(id) {
    if (!mongoose.isValidObjectId(id)) throw new InvalidUserIdError();
  }

  _selectProjection(select = []) {
    const fields = select.length ? select : this.#selectList;
    return fields.join(' ');
  }

  async findById(id, select = []) {
    this._validateId(id);
    return await this.model
      .findById(id)
      .select(this._selectProjection(select))
      .lean();
  }
  async create(userObject) {
    const user = await this.model.create(userObject);
    return user.toObject();
  }

  async save(user, select = []) {
    const id = user._id || user.id;

    this._validateId(id);
    const found_user = await this.model
      .findByIdAndUpdate(id.toString(), user, { new: true, lean: true })
      .select(this._selectProjection(select))
      .lean();
    return found_user;
  }

  async directUpdate(id, fields, select = []) {
    this._validateId(id);
    return await this.model
      .findByIdAndUpdate(id, fields, { new: true, lean: true })
      .select(this._selectProjection(select));
  }

  async find(filter = {}, options = {}) {
  const { limit = null, skip = 0, select = null, sort = null } = options;

  let query = this.model.find(filter).skip(skip);

  if (limit) query = query.limit(limit);
  if (select) query = query.select(this._selectProjection(select));
  if (sort) query = query.sort(sort);

  this.model.schema.eachPath((path, schemaType) => {
    if (schemaType.options?.ref) {
      query.populate(path);
    }
  });

  return await query.lean();
}

  async findOne(filter = {}, options = {}) {
    const { limit = null, skip = 0, select = [], sort = null } = options;
    let query = this.model.findOne(filter).skip(skip);
    if (limit) query = query.limit(limit);

    const projection = this._selectProjection(select);
    if (projection) query = query.select(projection);

    if (sort) query = query.sort(sort);
    return await query.lean();
  }

  async deleteOne(filter, select = []) {
    const deleted = await this.model
      .findOneAndDelete(filter)
      .select(this._selectProjection(select))
      .lean();
    if (!deleted) throw new UserNotFoundError();
    return deleted;
  }
  async deleteMany(filter, select = []) {
    return await this.model
      .deleteMany(filter)
      .select(this._selectProjection(SELECT));
  }

  async deleteById(id, select = []) {
    this._validateId(id);
    const deleted = await this.model
      .findByIdAndDelete(id)
      .select(this._selectProjection(select))
      .lean();
    return deleted;
  }
}

module.exports = BaseRepository;
