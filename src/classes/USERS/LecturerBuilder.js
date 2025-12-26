const UserBuilder = require('./UserBuilder');
const { userTypes } = require('../../config');
const Lecturer = require('./Lecturer');
class LecturerBuilder extends UserBuilder {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_LECTURER });

    Object.defineProperty(this, '_type', {
      value: userTypes.USER_LECTURER,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }
  async create() {
    const user = await super.create();
    return new Lecturer(user);
  }
}

module.exports = LecturerBuilder;
