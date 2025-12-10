const User = require('./User');
const { userTypes } = require('../../config');
const NullUser = require('./NullUser');
const Lecturer = require('./Lecturer');
class Student extends User {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_STUDENT });

    Object.defineProperty(this, '_type', {
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  static _wrapToStudent(obj) {
    if (obj === NullUser) return obj;
    return new Student(obj);
  }

  async save() {
    const user = await super.save();
    return Student._wrapToStudent(user);
  }

  async findByIdAndUpdate(userObject) {
    const user = await super.findByIdAndUpdate(userObject);
    return Student._wrapToStudent(user);
  }

  async findById(id) {
    const user = await super.findById(id);
    return Student._wrapToStudent(user);
  }

  async find(options = {}) {
    const users = await super.find(options);
    return users.map((user) => Student._wrapToStudent(user));
  }

  async findOne(options = {}) {
    const user = await super.findOne(options);
    return Student._wrapToStudent(user);
  }

  async deleteOne() {
    const user = await super.deleteOne();
    return Student._wrapToStudent(user);
  }

  async deleteById(id) {
    const user = await super.deleteById(id);
    return Student._wrapToStudent(user);
  }
}

module.exports = Student;
