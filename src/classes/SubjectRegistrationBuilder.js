const { SubjectRegistrationRepository } = require('./DATABASE');
const SubjectRegistration = require('./SubjectRegistration');
const repository = new SubjectRegistrationRepository();
class SubjectRegistrationBuilder {
  student;
  semester;
  subject;

  constructor(data = {}) {
    this.student - data.student;
    this.semester = data.semester;
    this.subject = data.subject;
    
  }

  #matchFieldsAndParams() {
    const fields = [ 'student',
      'semester',
      'subject',];
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
      const subjectRegistration = await repository.create(params);
      return new SubjectRegistration(subjectRegistration);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SubjectRegistrationBuilder;
