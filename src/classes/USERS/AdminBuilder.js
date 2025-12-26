const UserBuilder = require('./UserBuilder');
const Admin = require('./Admin');
const { userTypes } = require('../../config');

class AdminBuilder extends UserBuilder {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_ADMIN });

    Object.defineProperty(this, '_type', {
      value: userTypes.USER_ADMIN,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  async create() {
    const admin = await super.create();
    return new Admin(admin);
  }
}

module.exports = AdminBuilder;
