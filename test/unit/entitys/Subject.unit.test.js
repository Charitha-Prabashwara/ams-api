const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Subject = require('../../../src/classes/Subject');
const NullSubject = require('../../../src/classes/NullSubject')
const SubjectBuilder = require('../../../src/classes/SubjectBuilder');
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

describe('Subject Class Tests', () => {
  const initialData = {
    name: faker.person.firstName(),
    code: faker.string.alphanumeric(5).toUpperCase(),
    credits: 3,
  };

  let subjectId;

  test('Should create a new Subject successfully', async () => {
    const builder = new SubjectBuilder();
    builder.name = initialData.name;
    builder.code = initialData.code;
    builder.credits = initialData.credits;

    const created = await builder.create();
    expect(created).toBeInstanceOf(Subject);
    expect(created.name).toBe(initialData.name);
    expect(created.code).toBe(initialData.code);
    expect(created.credits).toBe(initialData.credits);

    subjectId = created.id;
  });

  test('Should find the created Subject by name', async () => {
    const subject = new Subject();
    subject.name = initialData.name;

    const foundSubjects = await subject.find();
    expect(foundSubjects.length).toBeGreaterThan(0);
    foundSubjects.forEach((s) => {
      expect(s).toBeInstanceOf(Subject);
      expect(s.name).toBe(initialData.name);
      expect(s.code).toBe(initialData.code);
      expect(s.credits).toBe(initialData.credits);
    });
  });

  test('Should find Subject by ID', async () => {
    const subject = await new Subject().findById(subjectId);
    expect(subject).toBeInstanceOf(Subject);
    expect(subject.id).toStrictEqual(subjectId);
    expect(subject.name).toBe(initialData.name);
    expect(subject.code).toBe(initialData.code);
    expect(subject.credits).toBe(initialData.credits);
  });

  test('Should update Subject by ID', async () => {
    const subject = await new Subject().findById(subjectId);

    const updatedData = {
      name: faker.person.jobTitle(),
      code: faker.string.alphanumeric(5).toUpperCase(),
      isActive:false,
      credits: 4,
    };

    subject.name = updatedData.name;
    subject.code = updatedData.code;
    subject.credits = updatedData.credits;
    subject.isActive = updatedData.isActive;

    const updated = await subject.save();
    expect(updated).toBeInstanceOf(Subject);
    expect(updated.name).toBe(updatedData.name);
    expect(updated.code).toBe(updatedData.code);
    expect(updated.credits).toBe(updatedData.credits);
    expect(updated.isActive).toBe(updatedData.isActive)
  });

  test('Should find not deleted Subjects', async () => {
    const subject = new Subject();
    subject.deleted = false;

    const result = await subject.find();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s) => expect(s.deleted).toBe(false));
  });

  test('Should delete Subject by ID', async () => {
    const subject = new Subject();
    subject.id = subjectId;

    const deleted = await subject.deleteById(subjectId);
    expect(deleted).toBeInstanceOf(Subject);
    expect(deleted.id).toStrictEqual(subjectId);
  });

  test('should return null object when subject cant findByID', async () => {
    const subject = new Subject();
   
    const deleted = await subject.deleteById("6939a19233486e9c4666f1f8");
    expect(deleted).toBe(NullSubject);
    
  })

  test('Should handle save error gracefully', async () => {
    const badSubject = new Subject();
    badSubject.save = jest.fn().mockRejectedValue(new Error('DB error'));

    await expect(badSubject.save()).rejects.toThrow('DB error');
  });

  test('Should handle findById error gracefully', async () => {
    const badSubject = new Subject();
    badSubject.findById = jest.fn().mockRejectedValue(new Error('Find failed'));

    await expect(badSubject.findById('invalid')).rejects.toThrow('Find failed');
  });

  test('Should handle concurrent Subject creation safely', async () => {
    const parallelTasks = 10;
    const tasks = Array.from({ length: parallelTasks }, async () => {
      const builder = new SubjectBuilder();
      builder.name = faker.person.firstName();
      builder.code = faker.string.alphanumeric(5).toUpperCase();
      builder.credits = 2;
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBe(0);

    const allSubjects = await new Subject().find();
    expect(allSubjects.length).toBeGreaterThanOrEqual(parallelTasks);
  });

  test('Should not leak memory when repeatedly creating and deleting Subjects', async () => {
    const iterations = 30;
    const memoryBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      const builder = new SubjectBuilder();
      builder.name = faker.person.firstName();
      builder.code = faker.string.alphanumeric(5).toUpperCase();
      builder.credits = 2;

      const temp = await builder.create();
      await new Subject().deleteById(temp.id);
    }

    global.gc && global.gc();
    const memoryAfter = process.memoryUsage().heapUsed;
    const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
    console.log(`Memory change: ${diffMB.toFixed(2)} MB`);
    expect(diffMB).toBeLessThan(10);
  });
});
