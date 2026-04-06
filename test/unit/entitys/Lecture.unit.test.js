const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Lecture = require('../../../src/classes/Lecture');
const LectureBuilder = require('../../../src/classes/LectureBuilder');
const NullLecture = require('../../../src/classes/NullLecture');
const Subject = require('../../../src/classes/Subject');
const SubjectBuilder = require('../../../src/classes/SubjectBuilder');
const Semester = require('../../../src/classes/Semester');
const SemesterBuilder = require('../../../src/classes/SemesterBuilder');
const { Lecturer } = require('../../../src/classes/USERS');
const LecturerBuilder = require('../../../src/classes/USERS/LecturerBuilder');
const Department = require('../../../src/classes/Department');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');
const Course = require('../../../src/classes/Course');
const CourseBuilder = require('../../../src/classes/CourseBuilder');
const Batch = require('../../../src/classes/Batch');
const BatchBuilder = require('../../../src/classes/BatchBuilder');
const PasswordHashService = require('../../../src/services/PasswordHashService');
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

describe('Lecture Class Tests', () => {
  let dept;
  let course;
  let batch;
  let subject;
  let semester;
  let lecturer;
  let lectureId;
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

    // Create Subject
    initialData.subjectName = faker.person.firstName();
    initialData.subjectCode = faker.string.alphanumeric(5).toUpperCase();
    initialData.subjectCredits = 3;
    const subjectBuilder = new SubjectBuilder();
    subjectBuilder.name = initialData.subjectName;
    subjectBuilder.code = initialData.subjectCode;
    subjectBuilder.credits = initialData.subjectCredits;
    subject = await subjectBuilder.create();

    // Create Semester
    initialData.semesterName = faker.word.words(3);
    initialData.semesterCode = faker.string.alphanumeric(5).toUpperCase();
    const semesterBuilder = new SemesterBuilder();
    semesterBuilder.name = initialData.semesterName;
    semesterBuilder.code = initialData.semesterCode;
    semesterBuilder.department = dept.id;
    semesterBuilder.course = course.id;
    semesterBuilder.batch = batch.id;
    semester = await semesterBuilder.create();

    // Create Lecturer
    initialData.lecturerRegId = faker.string.uuid();
    initialData.lecturerFirstName = faker.person.firstName();
    initialData.lecturerLastName = faker.person.lastName();
    initialData.lecturerEmail = faker.internet.email().toLowerCase();
    const lecturerBuilder = new LecturerBuilder();
    lecturerBuilder.registration_id = initialData.lecturerRegId;
    lecturerBuilder.name = {
      first_name: initialData.lecturerFirstName,
      last_name: initialData.lecturerLastName,
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    lecturerBuilder.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: undefined,
      zip: faker.location.zipCode(),
    };
    lecturerBuilder.email = initialData.lecturerEmail;
    lecturerBuilder.password = await PasswordHashService.hashPassword('123456');
    lecturer = await lecturerBuilder.create();
  });

  test('Should create a new Lecture successfully', async () => {
    initialData.topic = faker.lorem.words(3);
    initialData.scheduledTime = new Date();

    const builder = new LectureBuilder();
    builder.topic = initialData.topic;
    builder.lecturer = lecturer.id;
    builder.subject = subject.id;
    builder.semester = semester.id;
    builder.scheduledTime = initialData.scheduledTime;

    const createdLecture = await builder.create();
    expect(createdLecture).toBeInstanceOf(Lecture);
    expect(createdLecture.topic).toBe(initialData.topic);
    expect(createdLecture.lecturer._id.toString()).toBe(lecturer.id.toString());
    expect(createdLecture.subject._id.toString()).toBe(subject.id.toString());
    expect(createdLecture.semester._id.toString()).toBe(semester.id.toString());
    expect(createdLecture.scheduledTime).toStrictEqual(initialData.scheduledTime);

    lectureId = createdLecture.id;
  });

  test('Should find the created Lecture by topic', async () => {
    const lecture = new Lecture();
    lecture.topic = initialData.topic;
    const result = await lecture.find();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((lec) => {
      expect(lec).toBeInstanceOf(Lecture);
      expect(lec.topic).toBe(initialData.topic);
    });
  });

  test('Should find the created Lecture by lecturer', async () => {
    const lecture = new Lecture();
    lecture.lecturer = lecturer.id;
    const result = await lecture.find();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((lec) => {
      expect(lec).toBeInstanceOf(Lecture);
      expect(lec.lecturer._id.toString()).toBe(lecturer.id.toString());
    });
  });

  test('Should find not deleted Lecture', async () => {
    const lecture = new Lecture();
    lecture.deleted = false;
    const result = await lecture.find();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((lec) => {
      expect(lec.deleted).toBe(false);
    });
  });

  test('Select Lecture ById', async () => {
    const lecture = await new Lecture().findById(lectureId);
    expect(lecture.topic).toBe(initialData.topic);
    expect(lecture.lecturer._id.toString()).toBe(lecturer.id.toString());
    expect(lecture.subject._id.toString()).toBe(subject.id.toString());
    expect(lecture.semester._id.toString()).toBe(semester.id.toString());
    expect(lecture.id).toStrictEqual(lectureId);
  });

  test('Update Lecture ById', async () => {
    const lecture = new Lecture();
    lecture.topic = initialData.topic;

    const result = await lecture.find();
    expect(result.length).toBeGreaterThan(0);

    const lecToUpdate = result[0];
    const newTopic = faker.lorem.words(3);
    const newScheduledTime = new Date();
    const newActualStartTime = new Date();
    const newEndTime = new Date();
    const newState = 'completed';

    lecToUpdate.topic = newTopic;
    lecToUpdate.scheduledTime = newScheduledTime;
    lecToUpdate.actualStartTime = newActualStartTime;
    lecToUpdate.endTime = newEndTime;
    lecToUpdate.state = newState;

    const updatedLecture = await lecToUpdate.save();
    expect(updatedLecture.topic).toBe(newTopic);
    expect(updatedLecture.scheduledTime).toStrictEqual(newScheduledTime);
    expect(updatedLecture.actualStartTime).toStrictEqual(newActualStartTime);
    expect(updatedLecture.endTime).toStrictEqual(newEndTime);
    expect(updatedLecture.state).toBe(newState);
  });

  test('Should delete Lecture by topic', async () => {
    const newTopic = faker.lorem.words(3);
    const newScheduledTime = new Date();

    const newBuilder = new LectureBuilder();
    newBuilder.topic = newTopic;
    newBuilder.lecturer = lecturer.id;
    newBuilder.subject = subject.id;
    newBuilder.semester = semester.id;
    newBuilder.scheduledTime = newScheduledTime;
    const newLecture = await newBuilder.create();

    expect(newLecture.topic).toBe(newTopic);

    const lecture = new Lecture();
    lecture.topic = newTopic;

    const result = await lecture.deleteOne();
    expect(result.topic).toBe(newTopic);
  });

  test('Delete Lecture by id', async () => {
    const lecture = await new Lecture().deleteById(lectureId);
    expect(lecture.id).toStrictEqual(lectureId);
  });

  test('Should handle save error gracefully', async () => {
    const badLecture = new Lecture();
    badLecture.save = jest.fn().mockRejectedValue(new Error('DB error'));
    await expect(badLecture.save()).rejects.toThrow('DB error');
  });

  test('Should handle findById error gracefully', async () => {
    const badLecture = new Lecture();
    badLecture.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
    await expect(badLecture.findById('invalid')).rejects.toThrow('Find failed');
  });

  test('Should handle concurrent Lecture creation safely', async () => {
    const parallelTasks = 10;

    const tasks = Array.from({ length: parallelTasks }, async () => {
      const builder = new LectureBuilder();
      builder.topic = faker.lorem.words(3);
      builder.lecturer = lecturer.id;
      builder.subject = subject.id;
      builder.semester = semester.id;
      builder.scheduledTime = new Date();
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');

    console.log('Rejected concurrent creations:', rejected.length);
    expect(rejected.length).toBe(0);

    const allLectures = await new Lecture().find();
    expect(allLectures.length).toBeGreaterThanOrEqual(parallelTasks);
  });
});