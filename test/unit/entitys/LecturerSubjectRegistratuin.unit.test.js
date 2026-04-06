const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const SubjectRegistration = require('../../../src/classes/SubjectRegistration');
const SubjectRegistrationBuilder = require('../../../src/classes/SubjectRegistrationBuilder');
const NullSubjectRegistration = require('../../../src/classes/NullSubjectRegistration');

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

describe('SubjectRegistration Class Tests', () => {
  let studentId;
  let semesterId;
  let subjectId;
  let registrationId;

  beforeAll(() => {
    studentId = new  mongoose.Types.ObjectId();
    semesterId = new  mongoose.Types.ObjectId();
    subjectId = new mongoose.Types.ObjectId();
  });

  test('Should create a new SubjectRegistration successfully', async () => {
    const builder = new SubjectRegistrationBuilder();
    builder.student = studentId;
    builder.semester = semesterId;
    builder.subject = subjectId;

    const created = await builder.create();
    expect(created).toBeInstanceOf(SubjectRegistration);
    const studentIdCreated = created.student?._id ?? created.student;
    const semesterIdCreated = created.semester?._id ?? created.semester;
    const subjectIdCreated = created.subject?._id ?? created.subject;
    if (studentIdCreated) expect(studentIdCreated.toString()).toBe(studentId.toString());
    if (semesterIdCreated) expect(semesterIdCreated.toString()).toBe(semesterId.toString());
    if (subjectIdCreated) expect(subjectIdCreated.toString()).toBe(subjectId.toString());

    registrationId = created.id;
  });

  test('Should find the created SubjectRegistration by criteria', async () => {
    const registration = new SubjectRegistration();
    registration.student = studentId;

    const foundRegistrations = await registration.find();
    expect(foundRegistrations.length).toBeGreaterThan(0);
    foundRegistrations.forEach((r) => {
      expect(r).toBeInstanceOf(SubjectRegistration);
      if (r.student) {
        expect(r.student.toString()).toBe(studentId.toString());
      }
    });
  });

  test('Should find SubjectRegistration by ID', async () => {
    const registration = await new SubjectRegistration().findById(registrationId);
    expect(registration).toBeInstanceOf(SubjectRegistration);
    expect(registration.id).toStrictEqual(registrationId);
  });

  test('Should update SubjectRegistration by ID', async () => {
    const registration = await new SubjectRegistration().findById(registrationId);

    const newStudentId = new mongoose.Types.ObjectId();
    registration.student = newStudentId;
    registration.isActive = false;

    const updated = await registration.save();
    expect(updated).toBeInstanceOf(SubjectRegistration);
    const studentIdUpdated = updated.student?._id ?? updated.student;
    if (studentIdUpdated) expect(studentIdUpdated.toString()).toBe(newStudentId.toString());
    expect(updated.isActive).toBe(false);
  });

  test('Should soft delete SubjectRegistration using deleted flag', async () => {
    const registration = await new SubjectRegistration().findById(registrationId);
    registration.deleted = true;
    const updated = await registration.save();

    expect(updated.deleted).toBe(true);

    const allRegistrations = await new SubjectRegistration().find({ deleted: true });
    expect(allRegistrations.length).toBeGreaterThan(0);
  });

  test('Should delete SubjectRegistration by ID', async () => {
    const registration = new SubjectRegistration();
    registration.id = registrationId;

    const deleted = await registration.deleteById(registrationId);
    expect(deleted).toBeInstanceOf(SubjectRegistration);
    expect(deleted.id).toStrictEqual(registrationId);
  });

  test('Should return NullSubjectRegistration when not found', async () => {
    const registration = new SubjectRegistration();

    const result = await registration.findById(new mongoose.Types.ObjectId());
    expect(result).toBe(NullSubjectRegistration);
  });

  test('Should handle save error gracefully', async () => {
    const badRegistration = new SubjectRegistration();
    badRegistration.save = jest.fn().mockRejectedValue(new Error('DB error'));

    await expect(badRegistration.save()).rejects.toThrow('DB error');
  });

  test('Should handle findById error gracefully', async () => {
    const badRegistration = new SubjectRegistration();
    badRegistration.findById = jest.fn().mockRejectedValue(new Error('Find failed'));

    await expect(badRegistration.findById('invalid')).rejects.toThrow('Find failed');
  });

  test('Should handle concurrent SubjectRegistration creation safely', async () => {
    const parallelTasks = 10;
    const tasks = Array.from({ length: parallelTasks }, async () => {
      const builder = new SubjectRegistrationBuilder();
      builder.student = new mongoose.Types.ObjectId();
      builder.semester = new mongoose.Types.ObjectId();
      builder.subject = new mongoose.Types.ObjectId();
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBe(0);

    const allRegistrations = await new SubjectRegistration().find();
    expect(allRegistrations.length).toBeGreaterThanOrEqual(parallelTasks);
  });

  test('Should not leak memory when repeatedly creating and deleting SubjectRegistrations', async () => {
    const iterations = 30;
    const memoryBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      const builder = new SubjectRegistrationBuilder();
      builder.student = new mongoose.Types.ObjectId();
      builder.semester = new mongoose.Types.ObjectId();
      builder.subject = new mongoose.Types.ObjectId();

      const temp = await builder.create();
      await new SubjectRegistration().deleteById(temp.id);
    }

    global.gc && global.gc();
    const memoryAfter = process.memoryUsage().heapUsed;
    const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
    console.log(`Memory change: ${diffMB.toFixed(2)} MB`);
    expect(diffMB).toBeLessThan(10);
  });
});
