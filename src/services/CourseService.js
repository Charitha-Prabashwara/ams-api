const NullCourse = require('../classes/NullCourse')
const Course = require('../classes/Course')
const CourseBuilder = require('../classes/CourseBuilder')
const courseClass = new Course()

class CourseService{
    constructor(){

    }

    async getCourseById(id, select=[], filter={}) {
        return courseClass.findById(id, select, filter);
    }

    async getFindCourse(data = {}, options = {}) {
        const course = new Course();

        if(data.code) course.code = data.code;
        if(data.name) course.name = data.name;
        if(data.isActive != undefined) course.isActive = data.isActive;
        if(data.department) course.department = data.department;
        if(data.deleted != undefined) course.deleted = data.deleted;
        if(data.createdAt_timestamp) course.createdAt_timestamp = data.createdAt_timestamp;
        if(data.updatedAt_timestamp) course.updatedAt_timestamp = data.updatedAt_timestamp;

        return course.find(options);
    }

    async createCourse(code, name, department){
        const builder = new CourseBuilder();
        builder.code = code;
        builder.name = name;
        builder.department = department

        return builder.create()
    }

    async deleteCourseById(id){
        return courseClass.deleteById(id);
    }

    /**
 * Update an existing subject by its ID.
 *
 * @async
 * @param {Object} data - Update payload.
 * @param {String} data.id - ID of the subject to update. (required)
 * @param {String} [data.code] - New subject name.
 * @param {String} [data.name] - New subject code.
 * @param {String} [data.department] - New credit value.
 * @param {Boolean} [data.isActive] - New credit value.
 * @param {Boolean} [data.deleted] - Update deleted status.
 * @param {Number} [data.createdAt_timestamp] - Override created timestamp (not recommended).
 * @param {Number} [data.updatedAt_timestamp] - Override updated timestamp.
 *
 * @param {Array<string>} [select=[]] - Fields to return after update.
 *
 * @returns {Promise<Object|null>} Updated subject object, or null if not found.
 */
    async updateCourseById(data={}){
        return courseClass.findByIdAndUpdate(data)
    }

    isNullCourse(course){
        return course == NullCourse;
    }
}

module.exports = CourseService;

