const { CourseRepository } = require('./DATABASE');
const NullCourse = require('./NullCourse')
const repository = new CourseRepository();

class Course{
    id;
    code;
    name;
    department;
    isActive;
    deleted;
    createdAt_timestamp;
    updatedAt_timestamp;

    constructor(data = {}) {
        this.id = data._id ?? data.id;
        this.code = data.code;
        this.name = data.name;
        this.department= data.department;
        this.isActive = data.isActive;
        this.deleted = data.deleted;
        this.createdAt_timestamp = data.createdAt_timestamp;
        this.updatedAt_timestamp = data.updatedAt_timestamp;
    }

    #matchFieldsAndParams() {
        const fields = [
            'id',
            'code',
            'name',
            'department',
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

    #wrapTONullCourse() {
        return NullCourse;
    }
      
    #wrapToCourse(obj) {
        if (!obj) return this.#wrapTONullCourse();
        return new Course(obj);
    }

    async save(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const course = await repository.save(params, select);
      return this.#wrapToCourse(course);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[]) {
    try {
      const course = await repository.findById(id, select);
      return this.#wrapToCourse(course);
    } catch (error) {
      throw error;
    }
  }

   async findByIdAndUpdate(courseObj, select = []) {
    try {
      const course = await repository.save(courseObj, select);
      return this.#wrapToCourse(course);
    } catch (error) {
      throw error;
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const courses = await repository.find(params, options);
      return courses.map((courses) => this.#wrapToCourse(courses));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const course = await repository.deleteOne(params, select);
      return this.#wrapToCourse(course);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id, select=[]) {
    try {
      const course = await repository.deleteById(id, select);
      return this.#wrapToCourse(course);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Course