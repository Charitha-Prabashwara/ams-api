const { LectureRepository } = require('./DATABASE');
const NullLecture = require('./NullLecture')
const repository = new LectureRepository();
class Lecture {
  id;
  topic;
  lecturer;
  subject;
  semester;
  scheduledTime;
  actualStartTime;
  endTime;
  state;
  deleted;
  createdAt_timestamp;
  updatedAt_timestamp;
  

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.topic = data.topic;
    this.lecturer = data.lecturer;
    this.subject = data.subject;
    this.semester = data.semester;
    this.scheduledTime = data.scheduledTime;
    this.actualStartTime = data.actualStartTime;
    this.endTime = data.endTime;
    this.state = data.state;
    this.deleted = data.deleted;
    this.createdAt_timestamp = data.createdAt_timestamp;
    this.updatedAt_timestamp = data.updatedAt_timestamp;
  
  }

  /**
   * Prepares a parameter object for database operations,
   * including only defined fields.
   * @private
   * @returns {Promise<Object>} Parameters object for queries.
   */
  #matchFieldsAndParams() {
    const fields = [
      'id',
      'topic',
      'lecturer',
      'subject',
      'semester',
      'scheduledTime',
      'actualStartTime',
      'endTime',
      'state',
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

    #wrapTONullLecture() {
      return NullLecture;
    }
  
    #wrapToLecture(obj) {
      if (!obj) return this.#wrapTONullLecture();
      return new Lecture(obj);
    }

  async save(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await repository.save(params, select);
      return this.#wrapToLecture(batch);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[]) {
    try {
      const batch = await repository.findById(id, select);
      return this.#wrapToLecture(batch);
    } catch (error) {
      throw error;
    }
  }

   async findByIdAndUpdate(lectureObj, select = []) {
    try {
      const batch = await repository.save(lectureObj, select);
      return this.#wrapToLecture(batch);
    } catch (error) {
      throw error;
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const batches = await repository.find(params, options);
      return batches.map((batch) => this.#wrapToLecture(batch));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await repository.deleteOne(params, select);
      return this.#wrapToLecture(batch);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id, select=[]) {
    try {
      const batch = await repository.deleteById(id, select);
      return this.#wrapToLecture(batch);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Lecture;
