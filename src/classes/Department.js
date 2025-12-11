const { DepartmentRepository } = require('./DATABASE');
const repository = new DepartmentRepository();
const NullDepartment = require('./NullDepartment');
class Department {
  id;
  name;
  description;
  deleted;
  createdAt_timestamp;
  updatedAt_timestamp;

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.name = data.name;
    this.description = data.description;
    this.deleted = data.deleted;
    this.createdAt_timestamp = data.createdAt_timestamp;
    this.updatedAt_timestamp = data.updatedAt_timestamp;
  }

  #matchFieldsAndParams() {
    const fields = [
      'id',
      'name',
      'description',
      'deleted',
      'createdAt_timestamp',
      'updatedAt_timestamp',
    ];
    const params = {};

    for (const field of fields) {
      if (this[field] !== undefined) {
        params[field === 'id' ? '_id' : field] = this[field];
      }
    }
    return params;
  }

  #wrapTONullDepartment() {
    return NullDepartment;
  }

  #wrapToDepartment(obj) {
    if (!obj) return this.#wrapTONullDepartment();
    return new Department(obj);
  }

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const dept = await repository.save(params);
      return new Department(dept);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select = [], filter={}) {
    try {
      const dept = await repository.findById(id, select, filter);
      return this.#wrapToDepartment(dept);
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(deptObj, select = []) {
    try {
      const dept = await repository.save(deptObj, select);
      return this.#wrapToDepartment(dept);
    } catch (error) {
      throw error;
    }
  }

  async find(options = {}) {
    try {
      const params = this.#matchFieldsAndParams();
      const dept = await repository.find(params, options);
      return dept.map((dept) => this.#wrapToDepartment(dept));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne() {
    try {
      const params = this.#matchFieldsAndParams();
      const dept = repository.deleteOne(params);
      return this.#wrapToDepartment(dept);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const dept = await repository.deleteById(id);
      return this.#wrapToDepartment(dept);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Department;
