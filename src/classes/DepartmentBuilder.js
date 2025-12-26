const Department = require('./Department');
const { DepartmentRepository } = require('./DATABASE');
class DepartmentBuilder {
  name;
  description;
  constructor(data = {}) {
    this.name = data.name;
    this.description = data.description;
    this.repository = new DepartmentRepository();
  }

  #buildParams() {
    const fields = ['name', 'description'];
    const params = {};

    for (const field of fields) {
      if (this[field] !== undefined) {
        params[field] = this[field];
      }
    }
    return params;
  }

  async create() {
    try {
      const params = this.#buildParams();
      const dept = await this.repository.create(params);
      return new Department(dept);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DepartmentBuilder;
