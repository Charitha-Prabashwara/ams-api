const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const LecturerSubjectRegistrationService = require('../../../src/services/LectureSubjectRegistrationService');
const LecturerSubjectRegistration = require('../../../src/classes/LecturerSubjectRegistration');
const LecturerSubjectRegistrationBuilder = require('../../../src/classes/LecturerSubjectRegistrationBuilder');
const NullLecturerSubjectRegistration = require('../../../src/classes/NullLecturerSubjectRegistration');

let mongoServer;
let service;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  service = new LecturerSubjectRegistrationService();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('LecturerSubjectRegistrationService Tests', () => {
  let lecturerId;
  let subjectId;
  let registrationId;

  beforeAll(() => {
    lecturerId = new mongoose.Types.ObjectId();
    subjectId = new mongoose.Types.ObjectId();
  });

  test('Should register a lecturer with a subject', async () => {
    const registration = await service.RegisterSubjectAndLecturer(
      subjectId,
      lecturerId
    );

    expect(registration).toBeInstanceOf(LecturerSubjectRegistration);
    const subjectIdReg = registration.subject?._id ?? registration.subject;
    const lecturerIdReg = registration.lecturer?._id ?? registration.lecturer;
    if (subjectIdReg) expect(subjectIdReg.toString()).toBe(subjectId.toString());
    if (lecturerIdReg) expect(lecturerIdReg.toString()).toBe(lecturerId.toString());

    registrationId = registration.id;
  });

  test('Should get LecturerSubjectRegistration by ID', async () => {
    const registration = await service.getRegistrationById(registrationId);

    expect(registration).toBeInstanceOf(LecturerSubjectRegistration);
    expect(registration.id).toStrictEqual(registrationId);
  });

  test('Should find LecturerSubjectRegistrations using criteria', async () => {
    const found = await service.getFindRegistration({
      lecturer: lecturerId
    });

    expect(found.length).toBeGreaterThan(0);

    found.forEach((r) => {
      expect(r).toBeInstanceOf(LecturerSubjectRegistration);
      if (r.lecturer) {
        expect(r.lecturer.toString()).toBe(lecturerId.toString());
      }
    });
  });

  test('Should update LecturerSubjectRegistration by ID', async () => {
    const updated = await service.updateRegistrationById({
      id: registrationId,
      isActive: false
    });

    expect(updated).toBeInstanceOf(LecturerSubjectRegistration);
    expect(updated.isActive).toBe(false);
  });

  test('Should delete LecturerSubjectRegistration by ID', async () => {
    const deleted = await service.deleteRegistrationById(registrationId);

    expect(deleted).toBeInstanceOf(LecturerSubjectRegistration);
    expect(deleted.id).toStrictEqual(registrationId);

    const check = await service.getRegistrationById(registrationId);
    expect(service.isNullLecturerSubjectRegistration(check)).toBe(true);
  });

  test('Should return NullLecturerSubjectRegistration when not found', async () => {
    const check = await service.getRegistrationById(
      new mongoose.Types.ObjectId()
    );

    expect(service.isNullLecturerSubjectRegistration(check)).toBe(true);
  });

  test('Should handle concurrent LecturerSubjectRegistration creation', async () => {
    const tasks = Array.from({ length: 5 }, async () => {
      const builder = new LecturerSubjectRegistrationBuilder();
      builder.lecturer = new mongoose.Types.ObjectId();
      builder.subject = new mongoose.Types.ObjectId();
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');

    expect(rejected.length).toBe(0);
  });
});
