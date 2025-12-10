const UserBuilder = require('./UserBuilder');
const { userTypes } = require('../../config');
const Student = require('./Student');
class StudentBuilder extends UserBuilder {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_STUDENT });

    Object.defineProperty(this, '_type', {
      value: userTypes.USER_STUDENT,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  async create() {
    const user = await super.create();
    return new Student(user);
  }
}

module.exports = StudentBuilder;
