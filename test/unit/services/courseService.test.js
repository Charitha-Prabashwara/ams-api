const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CourseService = require('../../../src/services/CourseService');
const Course = require('../../../src/classes/Course');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');
const { faker } = require('@faker-js/faker');
const NullCourse = require('../../../src/classes/NullCourse');


let mongoServer;
let service = new CourseService()

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Course service test', () => { 
    let dept
    let createdCourse
    beforeAll(async()=>{
                const name = {
            long: faker.person.jobTitle(),
            short: faker.person.jobTitle(),
            key: faker.person.jobTitle(),
        };
        const description = faker.lorem.paragraph();
        const builder = new DepartmentBuilder();
            builder.name = name;
            builder.description = description;
        dept = await builder.create();
    })
    test('should create new course', async () => {
        const code = faker.string.uuid().toUpperCase()
        const name = faker.person.firstName()
        const course = await service.createCourse(code, name, dept.id);
        expect(course).toBeDefined()
        expect(course).not.toBe(NullCourse)
        expect(course).toBeInstanceOf(Course)
        createdCourse = course
        expect(course.department).toBeDefined()
        expect(course.code).toBe(code)
        expect(course.name).toBe(name)
        expect(course.department).toStrictEqual(dept.id)
    })

    test('should get course by course id', async () => {
        const course = await service.getCourseById(createdCourse.id)
        expect(course).toBeDefined()
        expect(course).not.toBe(NullCourse)
        expect(course).toBeInstanceOf(Course)
        expect(course.department).toBeDefined()
    })

    test('should find course by course code', async () => { 
        const code = createdCourse.code;
        const data = {
            code: code
        }
        const options= {
            limit:1
        }
        const courses = await service.getFindCourse(data, options);
        courses.forEach(course => {
            expect(course).toBeDefined()
            expect(course).not.toBe(NullCourse)
            expect(course).toBeInstanceOf(Course)
            expect(course.department).toBeDefined()
            expect(course.code).toBe(code)
        });

        expect(courses.length).toBe(1)
        
     })

    test('should find course by course name', async () => {
         const name = createdCourse.name;
        const data = {
            name: name
        }
        const options= {}
        const courses = await service.getFindCourse(data, options);
        courses.forEach(course => {
            expect(course).toBeDefined()
            expect(course).not.toBe(NullCourse)
            expect(course).toBeInstanceOf(Course)
            expect(course.department).toBeDefined()
            expect(course.name).toBe(name)
        });

       
     })

     test('should find course by its department', async () => {
        const department = createdCourse.department;
        const data = {department: department}
        const options= {}
        const courses = await service.getFindCourse(data, options);
        courses.forEach(course => {
            expect(course).toBeDefined()
            expect(course).not.toBe(NullCourse)
            expect(course).toBeInstanceOf(Course)
            expect(course.department).toBeDefined()
            expect(course.department).toStrictEqual(department)
        });
      })
    test('should update course by course id', async () => {
        const code = faker.string.uuid().toUpperCase()
        const name = faker.person.firstName()
        const data = {
            id:createdCourse.id,
            code:code,
            name:name,
            department: dept.id,
            isActive:false,
            deleted:false
        }

        const course = await service.updateCourseById(data)
        expect(course).toBeDefined()
        expect(course).not.toBe(NullCourse)
        expect(course).toBeInstanceOf(Course)
        expect(course.department).toBeDefined()
        expect(course.department).toStrictEqual(data.department)
        expect(course.code).toStrictEqual(data.code)
        expect(course.name).toStrictEqual(data.name)
        expect(course.isActive).toStrictEqual(data.isActive)
        expect(course.deleted).toStrictEqual(data.deleted)
     })

    test('should delete course by course id', async () => { 
        const course =await service.deleteCourseById(createdCourse.id)
        expect(course).toBeDefined()
        expect(course).not.toBe(NullCourse)
        expect(course).toBeInstanceOf(Course)
     })

    test('should return null object when cant find by id', async () => {
        const course = await service.getCourseById("693c6de4846f017f580afc37")
        expect(course).toBeDefined()
        expect(course).toBe(NullCourse)
    })

    test('should return null object when cant update by id', async () => {
        const course = await service.updateCourseById({id:"693c6de4846f017f580afc37"})
        expect(course).toBeDefined()
        expect(course).toBe(NullCourse)
    })

    
    test('should return null object when cant delete by id', async () => {
        const course = await service.deleteCourseById("693c6de4846f017f580afc37")
        expect(course).toBeDefined()
        expect(course).toBe(NullCourse)
    })

    test('should validate null objects using service', async () => { 

        const course = await service.deleteCourseById("693c6de4846f017f580afc37")
        expect(course).toBeDefined()
        expect(course).toBe(NullCourse)

        const isNullObject = service.isNullCourse(course)
        expect(isNullObject).toBe(true)
     })


 
})