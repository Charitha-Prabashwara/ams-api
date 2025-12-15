const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

const Course = require('../../../src/classes/Course');
const CourseBuilder = require('../../../src/classes/CourseBuilder');
const Department = require('../../../src/classes/Department');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');

const { MongoMemoryServer } = require('mongodb-memory-server');
const NullCourse = require('../../../src/classes/NullCourse');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Course Test', () => {
    let dept;
    let course;
    let data;
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
        data={
            code:faker.string.uuid().toUpperCase(),
            name:faker.person.firstName(),
            department: dept.id
        }

        const courseBuilder =new CourseBuilder()
        courseBuilder.code = data.code
        courseBuilder.name = data.name
        courseBuilder.department = data.department

        course = await courseBuilder.create()

        expect(course).toBeDefined()
        expect(course.code).toBe(data.code)
        expect(course.name).toBe(data.name)
        expect(course.department).toBe(data.department)
       
        
     })

     test('should get course by course id', async () => { 
        const courseClass = new Course();
        const foundCourse = await courseClass.findById(course.id)
        expect(foundCourse).toBeDefined()
        expect(foundCourse).not.toBe(NullCourse)
        expect(foundCourse).toBeInstanceOf(Course)
        expect(foundCourse.code).toBe(course.code)
        expect(foundCourse.name).toBe(course.name)
        expect(foundCourse.department).toStrictEqual(course.department)
    })

    test('should get course by course code', async () => { 
        const courseClass = new Course();
        courseClass.code = course.code

        const foundCourse = await courseClass.find()

        foundCourse.forEach(element => {
            expect(element).toBeDefined()
            expect(element).not.toBe(NullCourse)
            expect(element).toBeInstanceOf(Course)
            expect(element.code).toBe(course.code)
            expect(element.name).toBe(course.name)
            expect(element.department).toStrictEqual(course.department)
        });
        
    })

    test('should update course by course id', async () => { 
        data={
            code:faker.string.uuid().toUpperCase(),
            name:faker.person.firstName(),
            department: dept.id,
            isActive: false,
            deleted:true
        }


        const courseClass = new Course()
        const updatedCourse =await courseClass.findByIdAndUpdate({id:course.id, ...data})
        expect(updatedCourse).toBeDefined()
        expect(updatedCourse).not.toBe(NullCourse)
        expect(updatedCourse).toBeInstanceOf(Course)
        expect(updatedCourse.code).toBe(data.code)
        expect(updatedCourse.name).toBe(data.name)
        expect(updatedCourse.department).toStrictEqual(course.department)
        expect(updatedCourse.isActive).toBe(data.isActive)
        expect(updatedCourse.deleted).toBe(data.deleted)
     })

    test('should delete course by course id', async () => {
        const courseClass = new Course()
        const deleted = await courseClass.deleteById(course.id)
        expect(deleted).toBeDefined()
        expect(deleted).not.toBe(NullCourse)
        expect(deleted).toBeInstanceOf(Course)
        expect(deleted.code).toBe(data.code)
        expect(deleted.name).toBe(data.name)
        expect(deleted.department).toStrictEqual(course.department)
        expect(deleted.isActive).toBe(data.isActive)
        expect(deleted.deleted).toBe(data.deleted)
     })
 })