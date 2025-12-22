const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { faker } = require('@faker-js/faker');

const SubjectRegistrationService = require('../../../src/services/SubjectRegistrationService');
const SubjectRegistration = require('../../../src/classes/SubjectRegistration');
const SubjectRegistrationBuilder = require('../../../src/classes/SubjectRegistrationBuilder');
const NullSubjectRegistration = require('../../../src/classes/NullSubjectRegistration');

let mongoServer;
let service;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  service = new SubjectRegistrationService();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('SubjectRegistrationService Tests', () => {
  let studentId;
  let semesterId;
  let subjectId;
  let registrationId;

  beforeAll(() => {
    studentId = new mongoose.Types.ObjectId();
    semesterId = new mongoose.Types.ObjectId();
    subjectId = new mongoose.Types.ObjectId();
  });

  test('Should register a new SubjectRegistration', async () => {
    const registration = await service.Register(studentId, semesterId, subjectId);

    expect(registration).toBeInstanceOf(SubjectRegistration);
    expect(registration.student.toString()).toBe(studentId.toString());
    expect(registration.semester.toString()).toBe(semesterId.toString());
    expect(registration.subject.toString()).toBe(subjectId.toString());

    registrationId = registration.id;
  });

  test('Should get registration by ID', async () => {
    const registration = await service.getById(registrationId);

    expect(registration).toBeInstanceOf(SubjectRegistration);
    expect(registration.id).toStrictEqual(registrationId);
  });

  test('Should find registrations using criteria', async () => {
    const found = await service.getFindRegistration({ student: studentId });
    expect(found.length).toBeGreaterThan(0);
    found.forEach((r) => {
      expect(r).toBeInstanceOf(SubjectRegistration);
      expect(r.student.toString()).toBe(studentId.toString());
    });
  });

  test('Should find one registration using criteria', async () => {
    const foundOne = await service.getFindOneRegistration({ student: studentId });
    expect(foundOne).toBeInstanceOf(SubjectRegistration);
    expect(foundOne.student.toString()).toBe(studentId.toString());
  });

  test('Should update registration by ID', async () => {
    const newStudentId = new mongoose.Types.ObjectId();

    const updated = await service.updateRegistrationById({
      id: registrationId,
      student: newStudentId,
      isActive: false
    });

    expect(updated).toBeInstanceOf(SubjectRegistration);
    expect(updated.student.toString()).toBe(newStudentId.toString());
    expect(updated.isActive).toBe(false);
  });

  test('Should delete registration by ID', async () => {
    const deleted = await service.deleteById(registrationId);
    expect(deleted).toBeInstanceOf(SubjectRegistration);
    expect(deleted.id).toStrictEqual(registrationId);

    const check = await service.getById(registrationId);
    expect(service.isNullSubjectRegistration(check)).toBe(true);
  });

  test('Should return NullSubjectRegistration if not found', async () => {
    const check = await service.getById(new mongoose.Types.ObjectId());
    expect(service.isNullSubjectRegistration(check)).toBe(true);
  });

  test('Should handle concurrent registrations', async () => {
    const tasks = Array.from({ length: 5 }, async () => {
      const builder = new SubjectRegistrationBuilder();
      builder.student = new mongoose.Types.ObjectId();
      builder.semester = new mongoose.Types.ObjectId();
      builder.subject = new mongoose.Types.ObjectId();
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBe(0);
  });
});
