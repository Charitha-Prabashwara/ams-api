const { SubjectRepository } = require('./DATABASE');
const repository = new SubjectRepository();
const NullSubject = require('./NullSubject');
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

    #wrapTONullSubject() {
      return NullSubject;
    }
  
    #wrapToSubject(obj) {
      if (!obj) return this.#wrapTONullSubject();
      return new Subject(obj);
    }

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const subject = await repository.save(params);
      return new Subject(subject);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[], filter={}) {
    try {
      const subject = await repository.findById(id, select, filter);
      return this.#wrapToSubject(subject);
    } catch (error) {
      throw error;
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const subjects = await repository.find(params, options);
      return subjects.map((subject) => this.#wrapToSubject(subject));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const subject = await repository.deleteOne(params, select);
      return this.#wrapToSubject(subject)
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const subject = await repository.deleteById(id);
      return this.#wrapToSubject(subject)
    } catch (error) {
      throw error;
    }
  }

    async findByIdAndUpdate(subObj, select = []) {
    try {
      const subject = await repository.save(subObj, select);
      return this.#wrapToSubject(subject)
      
    }catch(error){
      throw error;
    }
  }
}

module.exports = Subject;
