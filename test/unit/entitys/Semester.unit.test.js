const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Semester = require('../../../src/classes/Semester');
const NullSemester = require('../../../src/classes/NullSemester');
const SemesterBuilder = require('../../../src/classes/SemesterBuilder');
const Department = require('../../../src/classes/Department');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');
const Course = require('../../../src/classes/Course');
const CourseBuilder = require('../../../src/classes/CourseBuilder');
const Batch = require('../../../src/classes/Batch');
const BatchBuilder = require('../../../src/classes/BatchBuilder');
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

describe('Semester Class Tests', () => {
  let dept;
  let course;
  let batch;
  const initialData = {};

  beforeAll(async () => {
    // Create Department
    const deptName = {
      long: faker.person.jobTitle(),
      short: faker.person.jobTitle(),
      key: faker.person.jobTitle()
    };
    const deptDescription = faker.lorem.paragraph();
    const deptBuilder = new DepartmentBuilder();
    deptBuilder.name = deptName;
    deptBuilder.description = deptDescription;
    dept = await deptBuilder.create();

    // Create Course
    initialData.courseCode = faker.string.uuid().toUpperCase();
    initialData.courseName = faker.person.firstName();
    const courseBuilder = new CourseBuilder();
    courseBuilder.code = initialData.courseCode;
    courseBuilder.name = initialData.courseName;
    courseBuilder.department = dept.id;
    course = await courseBuilder.create();

    // Create Batch
    initialData.batchName = faker.person.jobTitle();
    initialData.batchAcademic = { lb: faker.number.int({ min: 20, max: 25 }), ub: faker.number.int({ min: 26, max: 30 }) };
    const batchBuilder = new BatchBuilder();
    batchBuilder.name = initialData.batchName;
    batchBuilder.academic = initialData.batchAcademic;
    batch = await batchBuilder.create();
  });

  let semesterId;

  test('Should create a new Semester successfully', async () => {
    initialData.name = faker.word.words(3);
    initialData.code = faker.string.alphanumeric(5).toUpperCase();

    const builder = new SemesterBuilder();
    builder.name = initialData.name;
    builder.code = initialData.code;
    builder.department = dept.id;
    builder.course = course.id;
    builder.batch = batch.id;

    const created = await builder.create();
    expect(created).toBeInstanceOf(Semester);
    expect(created.name).toBe(initialData.name);
    expect(created.code).toBe(initialData.code);
    expect(created.department._id.toString()).toBe(dept.id.toString());
    expect(created.course._id.toString()).toBe(course.id.toString());
    expect(created.batch._id.toString()).toBe(batch.id.toString());

    semesterId = created.id;
  });

  test('Should find the created Semester by name', async () => {
    const semester = new Semester();
    semester.name = initialData.name;

    const foundSemesters = await semester.find();
    expect(foundSemesters.length).toBeGreaterThan(0);
    foundSemesters.forEach((s) => {
      expect(s).toBeInstanceOf(Semester);
      expect(s.name).toBe(initialData.name);
      expect(s.code).toBe(initialData.code);
      expect(s.department._id.toString()).toBe(dept.id.toString());
      expect(s.course._id.toString()).toBe(course.id.toString());
      expect(s.batch._id.toString()).toBe(batch.id.toString());
    });
  });

  test('Should find Semester by ID', async () => {
    const semester = await new Semester().findById(semesterId);
    expect(semester).toBeInstanceOf(Semester);
    expect(semester.id).toStrictEqual(semesterId);
    expect(semester.name).toBe(initialData.name);
    expect(semester.code).toBe(initialData.code);
  });

  test('Should update Semester by ID', async () => {
    const semester = await new Semester().findById(semesterId);
    const updatedData = {
      name: faker.word.words(2),
      code: faker.string.alphanumeric(5).toUpperCase()
    };
    semester.name = updatedData.name;
    semester.code = updatedData.code;

    const updated = await semester.save();
    expect(updated).toBeInstanceOf(Semester);
    expect(updated.name).toBe(updatedData.name);
    expect(updated.code).toBe(updatedData.code);
  });

  test('Should delete Semester by ID', async () => {
    const semester = new Semester();
    semester.id = semesterId;

    const deleted = await semester.deleteById(semesterId);
    expect(deleted).toBeInstanceOf(Semester);
    expect(deleted.id).toStrictEqual(semesterId);
  });

  test('Should return NullSemester when ID not found', async () => {
    const semester = new Semester();
    const result = await semester.findById(new mongoose.Types.ObjectId());
    expect(result).toBe(NullSemester);
  });

  test('Should handle save error gracefully', async () => {
    const badSemester = new Semester();
    badSemester.save = jest.fn().mockRejectedValue(new Error('DB error'));
    await expect(badSemester.save()).rejects.toThrow('DB error');
  });

  test('Should handle findById error gracefully', async () => {
    const badSemester = new Semester();
    badSemester.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
    await expect(badSemester.findById('invalid')).rejects.toThrow('Find failed');
  });

  test('Should handle concurrent Semester creation safely', async () => {
    const parallelTasks = 5;
    const tasks = Array.from({ length: parallelTasks }, async () => {
      const builder = new SemesterBuilder();
      builder.name = faker.word.words(2);
      builder.code = faker.string.alphanumeric(5).toUpperCase();
      builder.department = new mongoose.Types.ObjectId();
      builder.course = new mongoose.Types.ObjectId();
      builder.batch = new mongoose.Types.ObjectId();
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBe(0);
  });


});
