const { SemesterRepository } = require('./DATABASE');
const Semester = require('./Semester');
const repository = new SemesterRepository();

class SubjectBuilder {
  name;
  code;
  department;
  course;
  batch;

  constructor(data = {}) {
    this.name - data.name;
    this.code = data.code;
    this.department = data.department;
    this.course = data.course;
    this.batch = data.batch;
    
  }

  #matchFieldsAndParams() {
    const fields = ['name', 'code', 'department','course', 'batch'];
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
      const params = this.#matchFieldsAndParams();
      const semester = await repository.create(params);
      return new Semester(semester);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SubjectBuilder;
