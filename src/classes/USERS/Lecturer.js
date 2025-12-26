const User = require('./User');
const NullUser = require('./NullUser');
const { userTypes } = require('../../config');
class Lecturer extends User {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_LECTURER });

    Object.defineProperty(this, '_type', {
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  static _wrapToLecturer(obj) {
    if (obj === NullUser) return obj;
    return new Lecturer(obj);
  }

  async save() {
    const user = await super.save();
    return Lecturer._wrapToLecturer(user);
  }

  async findByIdAndUpdate(userObject) {
    const user = await super.findByIdAndUpdate(userObject);
    return Lecturer._wrapToLecturer(user);
  }

  async findById(id, select=[], filter={}) {
    const user = await super.findById(id, select, filter);
    return Lecturer._wrapToLecturer(user);
  }

  async find(options = {}) {
    const users = await super.find(options);
    return users.map((user) => Lecturer._wrapToLecturer(user));
  }

  async findOne(options = {}) {
    const user = await super.findOne(options);
    return Lecturer._wrapToLecturer(user);
  }

  async deleteOne() {
    const user = await super.deleteOne();
    return Lecturer._wrapToLecturer(user);
  }

  async deleteById(id) {
    const user = await super.deleteById(id);
    return Lecturer._wrapToLecturer(user);
  }
}

module.exports = Lecturer;
