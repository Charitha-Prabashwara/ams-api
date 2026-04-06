const { LectureRepository } = require('./DATABASE');
const Lecture = require('./Lecture');
const  repository = new LectureRepository();


class LectureBuilder {
  topic;
  lecturer;
  subject;
  semester;
  scheduledTime;
  /**
   * Create a new LecturerBuilder
   * @param {Object} [data={}] - source data to initialize the builder
   * @param {string} [data._id] - optional MongoDB id
   * @param {string} [data.topic]
   * @param {string}   [data.lecturer]
   * @param {string} [data.subject]
   * @param {string} [data.semester]
   *  @param {date} [data.scheduledTime]
   */
  constructor(data = {}) {
    this.topic = data.topic;
    this.lecturer = data.lecturer;
    this.subject = data.subject;
    this.semester = data.semester;
    this.scheduledTime = data.scheduledTime;
    
   
  }
  /**
   * Prepares a parameter object for database operations,
   * including only defined fields.
   * @private
   * @returns {Promise<Object>} Parameters object for queries.
   */
  #matchFieldsAndParams() {
    const fields = ['topic', 'lecturer','subject', 'semester', 'scheduledTime'];
    const params = {};
    for (const field of fields) {
      if (this[field] !== undefined) {
        params[field] = this[field];
      }
    }
    return params;
  }

  /**
   * Create a Lecture record in the repository using the fields set on the builder.
   * Only defined fields are forwarded to the repository.
   *
   * @returns {Promise<Lecture>} Promise that resolves to a new Lecture instance
   * @throws {Error} Propagates any repository error
   */
  async create() {
    try {
      const params = this.#matchFieldsAndParams();
      const lecture = await repository.create(params);
      return new Lecture(lecture);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = LectureBuilder;
