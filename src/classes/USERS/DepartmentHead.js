const User = require('./User');
const NullUser = require('./NullUser');
const { userTypes } = require('../../config');
class DepartmentHead extends User {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_DEPARTMENT });

    Object.defineProperty(this, '_type', {
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  static _wrapToDepartmentHead(obj) {
    if (obj === NullUser) return obj;
    return new DepartmentHead(obj);
  }

  async save() {
    const user = await super.save();
    return DepartmentHead._wrapToDepartmentHead(user);
  }

  async findByIdAndUpdate(userObject) {
    const user = await super.findByIdAndUpdate(userObject);
    return DepartmentHead._wrapToDepartmentHead(user);
  }

  async findById(id) {
    const user = await super.findById(id);
    return DepartmentHead._wrapToDepartmentHead(user);
  }

  async find(options = {}) {
    const users = await super.find(options);
    return users.map((user) => DepartmentHead._wrapToDepartmentHead(user));
  }

  async findOne(options = {}) {
    const user = await super.findOne(options);
    return DepartmentHead._wrapToDepartmentHead(user);
  }
  async deleteOne() {
    const user = await super.deleteOne();
    return DepartmentHead._wrapToDepartmentHead(user);
  }

  async deleteById(id) {
    const user = await super.deleteById(id);
    return DepartmentHead._wrapToDepartmentHead(user);
  }
}

module.exports = DepartmentHead;
