const { SubjectRepository } = require('./DATABASE');
const Subject = require('./Subject');

class SubjectBuilder {
  name;
  code;
  credits;

  constructor(data = {}) {
    this.name - data.name;
    this.code = data.code;
    this.credits = data.credits;
    this.repository = new SubjectRepository();
  }

  #matchFieldsAndParams() {
    const fields = ['name', 'code', 'credits'];
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
      const subject = await this.repository.create(params);
      return new Subject(subject);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SubjectBuilder;
