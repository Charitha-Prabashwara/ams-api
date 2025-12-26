const { UserModel } = require('../../models');
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor(selectList) {
    const defaultSelectList = ['-password'];
    super(UserModel, selectList ?? defaultSelectList);
  }

  async findById(id, select = [], filter={}) {
      this._validateId(id);
    
       return this.model
    .findOne({ _id: id, ...filter})   // ← filter goes here
    .select(this._selectProjection(select))
    .lean();
  }
}

module.exports = UserRepository;
