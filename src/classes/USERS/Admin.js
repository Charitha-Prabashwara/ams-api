const User = require('./User');
const NullUser = require('./NullUser');
const { userTypes } = require('../../config');
class Admin extends User {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_ADMIN });
    Object.defineProperty(this, '_type', {
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }
  static _wrapToAdmin(obj) {
    if (obj === NullUser) return obj;
    return new Admin(obj);
  }

  async save() {
    const user = await super.save();
    return Admin._wrapToAdmin(user);
  }

  async findByIdAndUpdate(userObject) {
    const user = await super.findByIdAndUpdate(userObject);
    return Admin._wrapToAdmin(user);
  }

  async findById(id) {
    const user = await super.findById(id);
    return Admin._wrapToAdmin(user);
  }

  async find(options = {}) {
    const users = await super.find(options);
    return users.map((user) => Admin._wrapToAdmin(user));
  }

  async findOne(options = {}) {
    const user = await super.findOne(options);
    return Admin._wrapToAdmin(user);
  }

  async deleteOne() {
    const user = await super.deleteOne();
    return Admin._wrapToAdmin(user);
  }

  async deleteById(id) {
    const user = await super.deleteById(id);
    return Admin._wrapToAdmin(user);
  }
}

module.exports = Admin;
