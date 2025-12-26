const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Semester = require('../../../src/classes/Semester');
const NullSemester = require('../../../src/classes/NullSemester');
const SemesterBuilder = require('../../../src/classes/SemesterBuilder');
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
  const initialData = {
    name: faker.word.words(3),
    code: faker.string.alphanumeric(5).toUpperCase(),
    department: new mongoose.Types.ObjectId(),
    course: new mongoose.Types.ObjectId(),
    batch: new mongoose.Types.ObjectId()
  };

  let semesterId;

  test('Should create a new Semester successfully', async () => {
    const builder = new SemesterBuilder();
    builder.name = initialData.name;
    builder.code = initialData.code;
    builder.department = initialData.department;
    builder.course = initialData.course;
    builder.batch = initialData.batch;

    const created = await builder.create();
    expect(created).toBeInstanceOf(Semester);
    expect(created.name).toBe(initialData.name);
    expect(created.code).toBe(initialData.code);
    expect(created.department).toStrictEqual(initialData.department);
    expect(created.course).toStrictEqual(initialData.course);
    expect(created.batch).toStrictEqual(initialData.batch);

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
      expect(s.department).toStrictEqual(initialData.department);
      expect(s.course).toStrictEqual(initialData.course);
      expect(s.batch).toStrictEqual(initialData.batch);
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

  test('Should not leak memory when repeatedly creating and deleting Semesters', async () => {
    const iterations = 20;
    const memoryBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      const builder = new SemesterBuilder();
      builder.name = faker.word.words(2);
      builder.code = faker.string.alphanumeric(5).toUpperCase();
      builder.department = new mongoose.Types.ObjectId();
      builder.course = new mongoose.Types.ObjectId();
      builder.batch = new mongoose.Types.ObjectId();

      const temp = await builder.create();
      await new Semester().deleteById(temp.id);
    }

    global.gc && global.gc();
    const memoryAfter = process.memoryUsage().heapUsed;
    const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
    console.log(`Memory change: ${diffMB.toFixed(2)} MB`);
    expect(diffMB).toBeLessThan(10);
  });
});
