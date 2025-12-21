const { options } = require('joi');
const { SemesterRepository } = require('./DATABASE');
const repository = new SemesterRepository();
const NullSemester = require('./NullSemester');
class Semester {
  id;
  name;
  code;
  department;
  course;
  batch;
  isActive;
  deleted;
  createdAt_timestamp;
  updatedAt_timestamp;

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.name = data.name;
    this.code = data.code;
    this.department = data.department;
    this.course = data.course;
    this.batch = data.batch;
    this.isActive = data.isActive;
    this.deleted = data.deleted;
    this.createdAt_timestamp = data.createdAt_timestamp;
    this.updatedAt_timestamp = data.updatedAt_timestamp;

 
  }
  #matchFieldsAndParams() {
    const fields = [
      'id',
      'name',
      'code',
      'department',
      'batch',
      'isActive',
      'deleted',
      'createdAt_timestamp',
      'updatedAt_timestamp'
    ];
    const params = {};

    for (const field of fields) {
      if (this[field] !== undefined) {
        params[field === 'id' ? '_id' : field] = this[field];
      }
    }
    return params;
  }

    #wrapTONullSemester() {
      return NullSemester;
    }
  
    #wrapToSemester(obj) {
      if (!obj) return this.#wrapTONullSemester();
      return new Semester(obj);
    }

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const semester = await repository.save(params);
      return new Semester(semester);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[], filter={}) {
    try {
      const semester = await repository.findById(id, select, filter);
      return this.#wrapToSemester(semester);
    } catch (error) {
      throw error;
    }
  }

  async findOne(data={}, options={}){
    try {
      const semester = await repository.findOne(data, options)
      return this.#wrapToSemester(semester)
    } catch (error) {
      throw error
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const semesters = await repository.find(params, options);
      return semesters.map((semester) => this.#wrapToSemester(semester));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const semester = await repository.deleteOne(params, select);
      return this.#wrapToSemester(semester)
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const semester = await repository.deleteById(id);
      return this.#wrapToSemester(semester)
    } catch (error) {
      throw error;
    }
  }

    async findByIdAndUpdate(subObj, select = []) {
    try {
      const semester = await repository.save(subObj, select);
      return this.#wrapToSemester(semester)
      
    }catch(error){
      throw error;
    }
  }
}

module.exports = Semester;
