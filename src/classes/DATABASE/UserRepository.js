const { UserModel } = require('../../models');
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor(selectList) {
    const defaultSelectList = ['-password'];
    super(UserModel, selectList ?? defaultSelectList);
  }
}

module.exports = UserRepository;
