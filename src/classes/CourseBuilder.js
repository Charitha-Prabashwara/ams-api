const { CourseRepository } = require('./DATABASE');
const Course = require('./Course')
const repository = new CourseRepository();

class CourseBuilder{
    code;
    name;
    department;
    isActive;
   
    constructor(data={}){
        this.code = data.code;
        this.name = data.name;
        this.department = data.department;
        this.isActive = data.isActive;
      
    }

    #buildParams() {
        const fields =  [
            'id',
            'code',
            'name',
            'department',
            'isActive'
        ];
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
      const params = this.#buildParams();
      const course = await repository.create(params);
      return new Course(course);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CourseBuilder