const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const LectureService = require('../../../src/services/LectureService');
const Lecture = require('../../../src/classes/Lecture');
const SubjectService = require('../../../src/services/SubjectService');
const SemesterService = require('../../../src/services/SemesterService');
const { faker } = require('@faker-js/faker');
const NullLecture = require('../../../src/classes/NullLecture');

let mongoServer;
let lectureService;
let subjectService;
let semesterService;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  lectureService = new LectureService();
  subjectService = new SubjectService();
  semesterService = new SemesterService();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Lecture service test', () => {
  let createdLecture;
  let subject;
  let semester;
  let lecturerId;

  beforeAll(async () => {
    // Create a subject
    subject = await subjectService.createNewSubject({
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      name: faker.word.words(2),
      credits: faker.number.int({ min: 1, max: 4 })
    });

    // Create a semester
    semester = await semesterService.createNewSemester({
      code: faker.string.alpha({ length: 4 }).toUpperCase(),
      name: faker.word.words(2),
      department: new mongoose.Types.ObjectId(),
      course: new mongoose.Types.ObjectId(),
      batch: new mongoose.Types.ObjectId()
    });

    // Create a lecturer ID (ObjectId for user)
    lecturerId = new mongoose.Types.ObjectId();
  });

  test('should create new lecture', async () => {
    const topic = faker.word.words(3);
    const scheduledTime = faker.date.future();

    const lecture = await lectureService.createNewLecture({
      topic,
      lecturer: lecturerId,
      subject: subject.id,
      semester: semester.id,
      scheduledTime
    });

    expect(lecture).toBeDefined();
    expect(lecture).not.toBe(NullLecture);
    expect(lecture).toBeInstanceOf(Lecture);

    expect(lecture.topic).toBe(topic);
    expect(lecture.lecturer).toBeNull(); // Since no User exists for this ObjectId
    expect(lecture.subject._id.toString()).toBe(subject.id.toString());
    expect(lecture.semester._id.toString()).toBe(semester.id.toString());
    expect(lecture.scheduledTime).toEqual(scheduledTime);

    createdLecture = lecture;
  });

  test('should get lecture by lecture id', async () => {
    const lecture = await lectureService.getLectureById(createdLecture.id);

    expect(lecture).toBeDefined();
    expect(lecture).not.toBe(NullLecture);
    expect(lecture).toBeInstanceOf(Lecture);
    expect(lecture.id).toStrictEqual(createdLecture.id);
  });

  test('should find lecture by topic', async () => {
    const data = { topic: createdLecture.topic };
    const options = {};

    const lectures = await lectureService.findLecture(data, options);

    expect(lectures).toBeDefined();
    expect(Array.isArray(lectures)).toBe(true);
    expect(lectures.length).toBeGreaterThan(0);

    lectures.forEach(lecture => {
      expect(lecture).toBeDefined();
      expect(lecture).not.toBe(NullLecture);
      expect(lecture).toBeInstanceOf(Lecture);
      expect(lecture.topic).toBe(createdLecture.topic);
    });
  });

  test('should find lecture by subject', async () => {
    const data = { subject: createdLecture.subject };
    const options = {};

    const lectures = await lectureService.findLecture(data, options);

    expect(lectures).toBeDefined();
    expect(Array.isArray(lectures)).toBe(true);
    expect(lectures.length).toBeGreaterThan(0);

    lectures.forEach(lecture => {
      expect(lecture).toBeDefined();
      expect(lecture).not.toBe(NullLecture);
      expect(lecture).toBeInstanceOf(Lecture);
      expect(lecture.subject.toString()).toBe(createdLecture.subject.toString());
    });
  });

  test('should find one lecture by topic', async () => {
    const data = { topic: createdLecture.topic };
    const options = {};

    const lecture = await lectureService.findOneLecture(data, options);

    expect(lecture).toBeDefined();
    expect(lecture).not.toBe(NullLecture);
    expect(lecture).toBeInstanceOf(Lecture);
    expect(lecture.topic).toBe(createdLecture.topic);
  });

  test('should delete lecture by lecture id', async () => {
    const lecture = await lectureService.deleteLectureById(createdLecture.id);

    expect(lecture).toBeDefined();
    expect(lecture).not.toBe(NullLecture);
    expect(lecture).toBeInstanceOf(Lecture);
  });

  test('should return null object when cant find by id', async () => {
    const lecture = await lectureService.getLectureById(
      '693c6de4846f017f580afc37'
    );

    expect(lecture).toBeDefined();
    expect(lecture).toBe(NullLecture);
  });

  test('should return null object when cant delete by id', async () => {
    const lecture = await lectureService.deleteLectureById(
      '693c6de4846f017f580afc37'
    );

    expect(lecture).toBeDefined();
    expect(lecture).toBe(NullLecture);
  });

  test('should validate null objects using service', async () => {
    const lecture = await lectureService.deleteLectureById(
      '693c6de4846f017f580afc37'
    );

    expect(lecture).toBeDefined();
    expect(lecture).toBe(NullLecture);

    const isNullObject = lectureService.isNullLecture(lecture);
    expect(isNullObject).toBe(true);
  });
});
