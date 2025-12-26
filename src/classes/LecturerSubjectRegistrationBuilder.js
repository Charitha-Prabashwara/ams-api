const { LecturerSubjectRegistrationRepository } = require('./DATABASE');
const LecturerSubjectRegistration = require('./LecturerSubjectRegistration');
const repository = new LecturerSubjectRegistrationRepository();

class LecturerSubjectRegistrationBuilder {
  lecturer;
  subject;

  constructor(data = {}) {
    this.lecturer = data.lecturer;
    this.subject = data.subject;
    
  }

  #matchFieldsAndParams() {
    const fields = [ 'lecturer','subject',];
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
      const lecturerSubjectRegistration = await repository.create(params);
      return new LecturerSubjectRegistration(lecturerSubjectRegistration);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LecturerSubjectRegistrationBuilder;
