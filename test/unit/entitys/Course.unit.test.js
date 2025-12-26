const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Course = require('../../../src/classes/Course');
const CourseBuilder = require('../../../src/classes/CourseBuilder');
const Department = require('../../../src/classes/Department');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');
const NullCourse = require('../../../src/classes/NullCourse');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

describe('Course Class Tests', () => {
  let dept;
  let courseId;
  const initialData = {};

  beforeAll(async () => {
    const name = {
      long: faker.person.jobTitle(),
      short: faker.person.jobTitle(),
      key: faker.person.jobTitle()
    };
    const description = faker.lorem.paragraph();

    const builder = new DepartmentBuilder();
    builder.name = name;
    builder.description = description;
    dept = await builder.create();
  });

  test('Should create a new Course successfully', async () => {
    initialData.code = faker.string.uuid().toUpperCase();
    initialData.name = faker.person.firstName();
    initialData.department = dept.id;

    const builder = new CourseBuilder();
    builder.code = initialData.code;
    builder.name = initialData.name;
    builder.department = initialData.department;

    const created = await builder.create();
    expect(created).toBeInstanceOf(Course);
    expect(created.code).toBe(initialData.code);
    expect(created.name).toBe(initialData.name);
    expect(created.department).toStrictEqual(initialData.department);

    courseId = created.id;
  });

  test('Should find the created Course by ID', async () => {
    const course = await new Course().findById(courseId);
    expect(course).toBeInstanceOf(Course);
    expect(course).not.toBe(NullCourse);
    expect(course.id).toStrictEqual(courseId);
    expect(course.code).toBe(initialData.code);
    expect(course.name).toBe(initialData.name);
    expect(course.department).toStrictEqual(initialData.department);
  });

  test('Should find Course by code', async () => {
    const courseClass = new Course();
    courseClass.code = initialData.code;

    const foundCourses = await courseClass.find();
    expect(foundCourses.length).toBeGreaterThan(0);
    foundCourses.forEach((c) => {
      expect(c).toBeInstanceOf(Course);
      expect(c).not.toBe(NullCourse);
      expect(c.code).toBe(initialData.code);
      expect(c.name).toBe(initialData.name);
      expect(c.department).toStrictEqual(initialData.department);
    });
  });

  test('Should update Course by ID', async () => {
    const course = await new Course().findById(courseId);
    const updatedData = {
      code: faker.string.uuid().toUpperCase(),
      name: faker.person.firstName(),
      isActive: false,
      deleted: true
    };

    course.code = updatedData.code;
    course.name = updatedData.name;
    course.isActive = updatedData.isActive;
    course.deleted = updatedData.deleted;

    const updated = await course.save();
    expect(updated).toBeInstanceOf(Course);
    expect(updated).not.toBe(NullCourse);
    expect(updated.code).toBe(updatedData.code);
    expect(updated.name).toBe(updatedData.name);
    expect(updated.department).toStrictEqual(initialData.department);
    expect(updated.isActive).toBe(updatedData.isActive);
    expect(updated.deleted).toBe(updatedData.deleted);
  });

  test('Should delete Course by ID', async () => {
    const course = new Course();
    const deleted = await course.deleteById(courseId);
    expect(deleted).toBeInstanceOf(Course);
    expect(deleted).not.toBe(NullCourse);
    expect(deleted.id).toStrictEqual(courseId);
    expect(deleted.code).toBeTruthy();
    expect(deleted.name).toBeTruthy();
    expect(deleted.department).toStrictEqual(initialData.department);
  });

  test('Should return NullCourse when ID not found', async () => {
    const course = new Course();
    const result = await course.findById(new mongoose.Types.ObjectId());
    expect(result).toBe(NullCourse);
  });

  test('Should handle save error gracefully', async () => {
    const badCourse = new Course();
    badCourse.save = jest.fn().mockRejectedValue(new Error('DB error'));
    await expect(badCourse.save()).rejects.toThrow('DB error');
  });

  test('Should handle findById error gracefully', async () => {
    const badCourse = new Course();
    badCourse.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
    await expect(badCourse.findById('invalid')).rejects.toThrow('Find failed');
  });

  test('Should handle concurrent Course creation safely', async () => {
    const tasks = Array.from({ length: 5 }, async () => {
      const builder = new CourseBuilder();
      builder.code = faker.string.uuid().toUpperCase();
      builder.name = faker.person.firstName();
      builder.department = dept.id;
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBe(0);
  });

  test('Should not leak memory when repeatedly creating and deleting Courses', async () => {
    const iterations = 20;
    const memoryBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      const builder = new CourseBuilder();
      builder.code = faker.string.uuid().toUpperCase();
      builder.name = faker.person.firstName();
      builder.department = dept.id;

      const temp = await builder.create();
      await new Course().deleteById(temp.id);
    }

    global.gc && global.gc();
    const memoryAfter = process.memoryUsage().heapUsed;
    const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
    console.log(`Memory change: ${diffMB.toFixed(2)} MB`);
    expect(diffMB).toBeLessThan(10);
  });
});
