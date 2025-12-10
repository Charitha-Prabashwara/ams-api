const { SubjectRepository } = require('./DATABASE');

class Subject {
  id;
  name;
  code;
  credits;
  deleted;
  createdAt_timestamp;
  updatedAt_timestamp;

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.name = data.name;
    this.code = data.code;
    this.credits = data.credits;
    this.deleted = data.deleted;
    this.createdAt = data.createdAt_timestamp;
    this.updatedAt = data.updatedAt_timestamp;

    this.repository = new SubjectRepository();
  }
  #matchFieldsAndParams() {
    const fields = [
      'id',
      'name',
      'code',
      'credits',
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

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const subject = await this.repository.save(params);
      return new Subject(subject);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const subject = await this.repository.findById(id);
      return new Subject(subject);
    } catch (error) {
      throw error;
    }
  }

  async find() {
    try {
      const params = this.#matchFieldsAndParams();
      const subjects = await this.repository.find(params);
      return subjects.map((subject) => new Subject(subject));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne() {
    try {
      const params = this.#matchFieldsAndParams();
      const subject = await this.repository.deleteOne(params);
      //not implemented
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const subject = await this.repository.deleteById(id);
      return new Subject(subject);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Subject;
