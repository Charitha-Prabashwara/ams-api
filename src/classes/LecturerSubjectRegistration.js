
const { LecturerSubjectRegistrationRepository } = require('./DATABASE');
const repository = new LecturerSubjectRegistrationRepository();
const NullLecturerSubjectRegistration = require('./NullLecturerSubjectRegistration');

class LecturerSubjectRegistration{
  id;
  lecturer;
  subject;
  isActive;
  deleted;
  createdAt_timestamp;
  updatedAt_timestamp;

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.lecturer = data.lecturer;
    this.subject = data.subject;
    this.isActive = data.isActive;
    this.deleted = data.deleted;
    this.createdAt_timestamp = data.createdAt_timestamp;
    this.updatedAt_timestamp = data.updatedAt_timestamp;
  }
  #matchFieldsAndParams() {
    const fields = [
      'id',
      'lecturer',
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

    #wrapToNullLecturerSubjectRegistrationRegistration() {
      return NullLecturerSubjectRegistration;
    }
  
    #wrapToLecturerSubjectRegistration(obj) {
      if (!obj) return this.#wrapToNullLecturerSubjectRegistrationRegistration();
      return new LecturerSubjectRegistration(obj);
    }

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const lecturerSubjectRegistration = await repository.save(params);
      return new LecturerSubjectRegistration(lecturerSubjectRegistration);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[], filter={}) {
    try {
      const lecturerSubjectRegistration = await repository.findById(id, select, filter);
      return this.#wrapToLecturerSubjectRegistration(lecturerSubjectRegistration);
    } catch (error) {
      throw error;
    }
  }

    async findOne(data={}, options={}){
    try {
      const lecturerSubjectRegistration = await repository.findOne(data, options)
      return this.#wrapToLecturerSubjectRegistration(lecturerSubjectRegistration)
    } catch (error) {
      throw error
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const lecturerSubjectRegistrations = await repository.find(params, options);
      return lecturerSubjectRegistrations.map((lecturerSubjectRegistration) => this.#wrapToLecturerSubjectRegistration(lecturerSubjectRegistration));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const lecturerSubjectRegistration = await repository.deleteOne(params, select);
      return this.#wrapToLecturerSubjectRegistration(lecturerSubjectRegistration)
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const lecturerSubjectRegistration = await repository.deleteById(id);
      return this.#wrapToLecturerSubjectRegistration(lecturerSubjectRegistration)
    } catch (error) {
      throw error;
    }
  }

    async findByIdAndUpdate(subObj, select = []) {
    try {
      const lecturerSubjectRegistration = await repository.save(subObj, select);
      return this.#wrapToLecturerSubjectRegistration(lecturerSubjectRegistration)
      
    }catch(error){
      throw error;
    }
  }
}

module.exports = LecturerSubjectRegistration;