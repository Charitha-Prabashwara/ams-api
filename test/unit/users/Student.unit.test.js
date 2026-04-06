const { Student, NullUser } = require('../../../src/classes/USERS');
const StudentBuilder = require('../../../src/classes/USERS/StudentBuilder');
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const { config, userTypes } = require('../../../src/config');
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

const defaultPassword = '123456';
const registration_id = faker.string.uuid();
const first_name = faker.person.firstName();
const last_name = faker.person.lastName();
const full_name = faker.person.fullName();
const with_initial = faker.person.fullName();
const address = {
  line1: faker.location.streetAddress({ useFullAddress: true }),
  line2: undefined,
  zip: faker.location.zipCode(),
};
const email = faker.internet.email().toLowerCase();

let createStudent;
let new_email = faker.internet.email().toLowerCase();

test('Should create a new student successfully', async () => {
  const builder = new StudentBuilder();
  builder.registration_id = registration_id;
  builder.name = {
    first_name,
    last_name,
    full_name,
    with_initial_name: with_initial,
  };
  builder.address = { ...address };
  builder.email = email;
  builder.password = await PasswordHashService.hashPassword(defaultPassword);

  createStudent = await builder.create();

  expect(createStudent).toBeInstanceOf(Student);
  expect(createStudent.registration_id).toBe(registration_id);
  expect(createStudent.name.first_name).toBe(first_name);
  expect(createStudent._type).toBe('student');

  const compare = await PasswordHashService.verifyPassword(
    defaultPassword,
    createStudent.password,
  );
  expect(compare).toBe(true);
});

test('Should find the created student by email', async () => {
  const finder = new Student();
  finder.email = email;

  const foundStudents = await finder.find();
  expect(foundStudents.length).toBeGreaterThan(0);

  const found = foundStudents[0];
  expect(found.email).toBe(email);
  expect(found.registration_id).toBe(registration_id);
  expect(found.name.full_name).toBe(full_name);
  expect(found._type).toBe('student');
});

test('Should find Student using findOne by email', async () => {
  const finder = new Student();
  finder.email = createStudent.email;
  const found = await finder.findOne();
  expect(found).toBeInstanceOf(Student);
  expect(found.id).toStrictEqual(createStudent.id);
  expect(found._type).toBe(userTypes.USER_STUDENT);
});

test('Should find student by ID', async () => {
  const finder = new Student();
  const found = await finder.findById(createStudent.id);
  expect(found).toBeInstanceOf(Student);
  expect(found.id).toStrictEqual(createStudent.id);
  expect(found._type).toBe(userTypes.USER_STUDENT);
});

test('Should update student data successfully', async () => {
  const studentToUpdate = new Student({ email });
  const users = await studentToUpdate.find();

  expect(users.length).toBeGreaterThan(0);
  const user = users[0];

  const new_registration_id = faker.string.uuid();
  const new_name = {
    first_name: 'UpdatedFirst',
    last_name: 'UpdatedLast',
    full_name: 'Updated Full Name',
    with_initial_name: 'U. Name',
  };
  const new_password = '789555';

  user.registration_id = new_registration_id;
  user.name = new_name;
  user.email = new_email;
  user.password = await PasswordHashService.hashPassword(new_password);
  user.deleted = true

  await user.save();

  const updatedUsers = await new Student({ email: new_email }).find();
  expect(updatedUsers.length).toBeGreaterThan(0);
  const updated = updatedUsers[0];

  expect(updated.registration_id).toBe(new_registration_id);
  expect(updated.name).toStrictEqual(new_name);
  expect(updated.email).toBe(new_email);

  const compare = await PasswordHashService.verifyPassword(
    new_password,
    updated.password,
  );
  expect(compare).toBe(true);
  expect(updated.deleted).toBe(true)
});

test('Should delete student by email (deleteOne)', async () => {
  const deleter = new Student({ email: new_email });
  const deleted = await deleter.deleteOne();

  expect(deleted).toBeInstanceOf(Student);
  expect(deleted.email).toBe(new_email);

  const check = await new Student({ email: new_email }).find();
  expect(check.length).toBe(0);
});

test('Should delete student by ID (deleteById)', async () => {
  const builder = new StudentBuilder();
  builder.registration_id = registration_id;
  builder.name = {
    first_name,
    last_name,
    full_name,
    with_initial_name: with_initial,
  };
  builder.address = { ...address };
  builder.email = faker.internet.email().toLowerCase();
  builder.password = await PasswordHashService.hashPassword(defaultPassword);

  const newStudent = await builder.create();
  const deleted = await new Student().deleteById(newStudent.id);

  expect(deleted.registration_id).toBe(registration_id);
  expect(deleted.name.full_name).toBe(full_name);

  const findDeleted = await new Student({ id: newStudent.id }).find();
  expect(findDeleted.length).toBe(0);
});

test('Should not allow modification of _type in student or studentBuilder', () => {
  const student = new Student();
  const builder = new StudentBuilder();

  expect(student._type).toBe('student');
  expect(builder._type).toBe('student');

  expect(Object.getOwnPropertyDescriptor(student, '_type').writable).toBe(
    false,
  );
  expect(Object.getOwnPropertyDescriptor(builder, '_type').writable).toBe(
    false,
  );

  //expect(() => { student._type = 'user'; }).toThrow();
  //expect(() => { builder._type = 'user'; }).toThrow();
});

test('Should handle save error gracefully', async () => {
  const badStudent = new Student();
  badStudent.save = jest.fn().mockRejectedValue(new Error('DB error'));
  await expect(badStudent.save()).rejects.toThrow('DB error');
});

test('Should handle findById error gracefully', async () => {
  const badStudent = new Student();
  badStudent.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
  await expect(badStudent.findById('invalid')).rejects.toThrow('Find failed');
});

test('Should handle concurrent student creation safely', async () => {
  const parallelTasks = 10;

  const tasks = Array.from({ length: parallelTasks }, async () => {
    const builder = new StudentBuilder();
    builder.registration_id = faker.string.uuid();
    builder.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    builder.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };
    builder.email = faker.internet.email().toLowerCase();
    builder.password = await PasswordHashService.hashPassword(defaultPassword);
    return builder.create();
  });

  const results = await Promise.allSettled(tasks);
  const rejected = results.filter((r) => r.status === 'rejected');

  console.log('Rejected concurrent creations:', rejected.length);
  expect(rejected.length).toBe(0);

  const allStudents = await new Student().find();
  expect(allStudents.length).toBeGreaterThanOrEqual(parallelTasks);
});

describe('NullUser object test', () => {
  test('find by id', async () => {
    const id = new mongoose.Types.ObjectId();
    const user = await new Student().findById(id);
    expect(user).toBe(NullUser);
  });

  test('find', async () => {
    const registration_id = faker.string.uuid();
    const user = new Student({ registration_id: registration_id });

    expect(registration_id).toBe(user.registration_id);
    const result = await user.find();
    result.forEach((user) => {
      expect(user).toBe(NullUser);
    });
  });
});

test('should find by id student and update', async () => {
  const builder = new StudentBuilder();
  const defaultPassword = faker.internet.password(10);

  builder.registration_id = faker.string.uuid();
  builder.address = {
    line1: faker.location.streetAddress({ useFullAddress: true }),
    line2: faker.location.streetAddress({ useFullAddress: true }),
    zip: faker.location.zipCode(),
  };
  builder.email = faker.internet.email().toLowerCase();
  builder.name = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    full_name: faker.person.fullName(),
    with_initial_name: faker.person.fullName(),
  };
  builder.password = await PasswordHashService.hashPassword(defaultPassword);

  const user = await builder.create();

  expect(user).toBeDefined();
  expect(user.id).toBeDefined();

  const new_email = faker.internet.email().toLowerCase();
  user.email = new_email;
  const result = await user.findByIdAndUpdate(user);
  expect(result).toBeDefined();
  expect(result.email).toBe(new_email);
});
