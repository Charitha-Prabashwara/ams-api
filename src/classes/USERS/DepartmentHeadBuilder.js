const UserBuilder = require('./UserBuilder');
const DepartmentHead = require('./DepartmentHead');
const { userTypes } = require('../../config');

class DepartmentHeadBuilder extends UserBuilder {
  constructor(data = {}) {
    super({ ...data, type: userTypes.USER_DEPARTMENT });

    Object.defineProperty(this, '_type', {
      value: userTypes.USER_DEPARTMENT,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  async create() {
    const departmentHead = await super.create();
    return new DepartmentHead(departmentHead);
  }
}

module.exports = DepartmentHeadBuilder;
