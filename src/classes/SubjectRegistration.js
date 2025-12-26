const { SubjectRegistrationRepository } = require('./DATABASE');
const repository = new SubjectRegistrationRepository();
const NullSubjectRegistration = require('./NullSubjectRegistration');

class SubjectRegistration{
  id;
  student;
  semester;
  subject;
  isActive;
  deleted;
  createdAt_timestamp;
  updatedAt_timestamp;

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.student = data.student;
    this.semester = data.semester;
    this.subject = data.subject;
    this.isActive = data.isActive;
    this.deleted = data.deleted;
    this.createdAt = data.createdAt_timestamp;
    this.updatedAt = data.updatedAt_timestamp;

 
  }
  #matchFieldsAndParams() {
    const fields = [
      'id',
      'student',
      'semester',
      'subject',
      'isActive',
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

    #wrapToNullSubjectRegistrationRegistration() {
      return NullSubjectRegistration;
    }
  
    #wrapToSubjectRegistration(obj) {
      if (!obj) return this.#wrapToNullSubjectRegistrationRegistration();
      return new SubjectRegistration(obj);
    }

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const subjectRegistration = await repository.save(params);
      return new SubjectRegistration(subjectRegistration);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[], filter={}) {
    try {
      const subjectRegistration = await repository.findById(id, select, filter);
      return this.#wrapToSubjectRegistration(subjectRegistration);
    } catch (error) {
      throw error;
    }
  }

    async findOne(data={}, options={}){
    try {
      const subjectRegistration = await repository.findOne(data, options)
      return this.#wrapToSubjectRegistration(subjectRegistration)
    } catch (error) {
      throw error
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const subjectRegistrations = await repository.find(params, options);
      return subjectRegistrations.map((subjectRegistration) => this.#wrapToSubjectRegistration(subjectRegistration));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const subjectRegistration = await repository.deleteOne(params, select);
      return this.#wrapToSubjectRegistration(subjectRegistration)
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const subjectRegistration = await repository.deleteById(id);
      return this.#wrapToSubjectRegistration(subjectRegistration)
    } catch (error) {
      throw error;
    }
  }

    async findByIdAndUpdate(subObj, select = []) {
    try {
      const subjectRegistration = await repository.save(subObj, select);
      return this.#wrapToSubjectRegistration(subjectRegistration)
      
    }catch(error){
      throw error;
    }
  }
}

module.exports = SubjectRegistration;