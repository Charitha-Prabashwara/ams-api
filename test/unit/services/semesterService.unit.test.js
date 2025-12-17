const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { faker } = require('@faker-js/faker');

const SemesterService = require('../../../src/services/SemesterService');
const NullSemester = require('../../../src/classes/NullSemester');

let mongoServer;
let service;

/* ====== HELPERS ====== */
const createObjectId = () => new mongoose.Types.ObjectId();

const createSemesterPayload = () => ({
  code: faker.string.alpha({ length: 4 }).toUpperCase(),
  name: faker.word.words(2),
  department: createObjectId(),
  course: createObjectId(),
  batch: createObjectId()
});

/* ====== DB SETUP ====== */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(() => {
  service = new SemesterService();
});

describe('Semester Service – Full Test Suite', () => {
  let createdSemester;

  /* ================= CREATE ================= */

  test('should create new semester', async () => {
    const payload = createSemesterPayload();

    const semester = await service.createNewSemester(payload);

    expect(semester).toBeDefined();
    expect(semester.id).toBeDefined();
    expect(semester.code).toBe(payload.code);
    expect(semester.name).toBe(payload.name);
    expect(semester.department.toString()).toBe(payload.department.toString());
    expect(semester.course.toString()).toBe(payload.course.toString());
    expect(semester.batch.toString()).toBe(payload.batch.toString());

    createdSemester = semester;
  });

  /* ================= UPDATE ================= */

  test('should update semester by id', async () => {
    const newName = faker.word.words(3);

    const semester = await service.updateSemesterById({
      id: createdSemester.id,
      name: newName
    });

    expect(semester).toBeDefined();
    expect(semester).not.toBe(NullSemester);
    expect(semester.name).toBe(newName);
  });

  test('should soft delete semester', async () => {
    const semester = await service.updateSemesterById({
      id: createdSemester.id,
      deleted: true
    });

    expect(semester).toBeDefined();
    expect(semester.deleted).toBe(true);
  });

  /* ================= FIND ================= */

  test('should find semester by code', async () => {
    const semesters = await service.findSemester({
      code: createdSemester.code
    });

    expect(semesters.length).toBeGreaterThan(0);

    semesters.forEach(s => {
      expect(s.code).toBe(createdSemester.code);
    });
  });

  test('should find semester by department + course + batch', async () => {
    const semesters = await service.findSemester({
      department: createdSemester.department,
      course: createdSemester.course,
      batch: createdSemester.batch
    });

    expect(semesters.length).toBeGreaterThan(0);
  });

  test('should find by createdAt timestamp', async () => {
    const semesters = await service.findSemester({
      createdAt_timestamp: createdSemester.createdAt_timestamp
    });

    semesters.forEach(s => {
      expect(s.createdAt_timestamp.toISOString())
        .toBe(createdSemester.createdAt_timestamp.toISOString());
    });
  });

  test('should NOT return deleted semester when filtered', async () => {
    const semesters = await service.findSemester(
      { name: createdSemester.name },
      { deleted: false }
    );

    expect(semesters.length).toBe(0);
  });

  /* ================= DELETE ================= */

  test('should delete semester by id', async () => {
    const semester = await service.deleteSemesterById(createdSemester.id);

    expect(semester).toBeDefined();
    expect(semester).not.toBe(NullSemester);
  });

  test('should return NullSemester for invalid id delete', async () => {
    const semester = await service.deleteSemesterById(createObjectId());
    expect(service.isNullSemester(semester)).toBe(true);
  });

  /* ================= CONCURRENCY ================= */

  test('should handle concurrent semester creation safely', async () => {
    const base = createSemesterPayload();

    const tasks = Array.from({ length: 5 }).map(() =>
      service.createNewSemester({
        ...base,
        code: faker.string.alpha(5).toUpperCase() // unique per request
      })
    );

    const results = await Promise.all(tasks);

    expect(results.length).toBe(5);
    results.forEach(s => expect(s.id).toBeDefined());
  });

  /* ================= MEMORY SAFETY ================= */

  test('should not leak memory on repeated operations', async () => {
    const startHeap = process.memoryUsage().heapUsed;

    for (let i = 0; i < 50; i++) {
      const payload = createSemesterPayload();
      const s = await service.createNewSemester(payload);
      await service.deleteSemesterById(s.id);
    }

    global.gc && global.gc(); // works if node --expose-gc

    const endHeap = process.memoryUsage().heapUsed;
    const diffMB = (endHeap - startHeap) / 1024 / 1024;

    expect(diffMB).toBeLessThan(10); // safe threshold
  });
});
