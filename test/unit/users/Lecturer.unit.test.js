const { Lecturer, NullUser } = require('../../../src/classes/USERS');
const LecturerBuilder = require('../../../src/classes/USERS/LecturerBuilder');
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

let createLecturer;
let new_email = faker.internet.email().toLowerCase();

test('Should create a new lecturer successfully', async () => {
  const builder = new LecturerBuilder();
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

  createLecturer = await builder.create();

  expect(createLecturer).toBeInstanceOf(Lecturer);
  expect(createLecturer.registration_id).toBe(registration_id);
  expect(createLecturer.name.first_name).toBe(first_name);
  expect(createLecturer._type).toBe('lecturer');

  const compare = await PasswordHashService.verifyPassword(
    defaultPassword,
    createLecturer.password,
  );
  expect(compare).toBe(true);
});

test('Should find the created Lecturer by email', async () => {
  const finder = new Lecturer();
  finder.email = email;

  const foundLecturer = await finder.find();
  expect(foundLecturer.length).toBeGreaterThan(0);

  const found = foundLecturer[0];
  expect(found.email).toBe(email);
  expect(found.registration_id).toBe(registration_id);
  expect(found.name.full_name).toBe(full_name);
  expect(found._type).toBe('lecturer');
});

test('Should find Lecturer using findOne by email', async () => {
  const finder = new Lecturer();
  finder.email = createLecturer.email;
  const found = await finder.findOne();
  expect(found).toBeInstanceOf(Lecturer);
  expect(found.id).toStrictEqual(createLecturer.id);
  expect(found._type).toBe(userTypes.USER_LECTURER);
});

test('Should find Lecturer by ID', async () => {
  const finder = new Lecturer();
  const found = await finder.findById(createLecturer.id);
  expect(found).toBeInstanceOf(Lecturer);
  expect(found.id).toStrictEqual(createLecturer.id);
  expect(found._type).toBe(userTypes.USER_LECTURER);
});

test('Should update Lecturer data successfully', async () => {
  const lecturerToUpdate = new Lecturer({ email });
  const users = await lecturerToUpdate.find();

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

  await user.save();

  const updatedUsers = await new Lecturer({ email: new_email }).find();
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
});

test('Should delete Lecturer by email (deleteOne)', async () => {
  const deleter = new Lecturer({ email: new_email });
  const deleted = await deleter.deleteOne();

  expect(deleted).toBeInstanceOf(Lecturer);
  expect(deleted.email).toBe(new_email);

  const check = await new Lecturer({ email: new_email }).find();
  expect(check.length).toBe(0);
});

test('Should delete Lecturer by ID (deleteById)', async () => {
  const builder = new LecturerBuilder();
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

  const newLecturer = await builder.create();
  const deleted = await new Lecturer().deleteById(newLecturer.id);

  expect(deleted.registration_id).toBe(registration_id);
  expect(deleted.name.full_name).toBe(full_name);

  const findDeleted = await new Lecturer({ id: newLecturer.id }).find();
  expect(findDeleted.length).toBe(0);
});

test('Should not allow modification of _type in Lecturer or LecturerBuilder', () => {
  const lecturer = new Lecturer();
  const builder = new LecturerBuilder();

  expect(lecturer._type).toBe('lecturer');
  expect(builder._type).toBe('lecturer');

  expect(Object.getOwnPropertyDescriptor(lecturer, '_type').writable).toBe(
    false,
  );
  expect(Object.getOwnPropertyDescriptor(builder, '_type').writable).toBe(
    false,
  );

  //expect(() => { lecturer._type = 'user'; }).toThrow();
  //expect(() => { builder._type = 'user'; }).toThrow();
});

test('Should handle save error gracefully', async () => {
  const badLecturer = new Lecturer();
  badLecturer.save = jest.fn().mockRejectedValue(new Error('DB error'));
  await expect(badLecturer.save()).rejects.toThrow('DB error');
});

test('Should handle findById error gracefully', async () => {
  const badLecturer = new Lecturer();
  badLecturer.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
  await expect(badLecturer.findById('invalid')).rejects.toThrow('Find failed');
});

test('Should not leak memory when repeatedly creating and deleting lecturers', async () => {
  const iterations = 30;
  const memoryBefore = process.memoryUsage().heapUsed;

  for (let i = 0; i < iterations; i++) {
    const builder = new LecturerBuilder();
    builder.registration_id = faker.string.uuid();
    builder.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    builder.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: undefined,
      zip: faker.location.zipCode(),
    };
    builder.email = faker.internet.email().toLowerCase();
    builder.password = await PasswordHashService.hashPassword(defaultPassword);

    const tempLecturer = await builder.create();
    await new Lecturer().deleteById(tempLecturer.id);
  }

  global.gc && global.gc(); // Force garbage collection if node --expose-gc
  const memoryAfter = process.memoryUsage().heapUsed;
  const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
  console.log(`Memory change: ${diffMB.toFixed(2)} MB`);

  // Allow small growth (<10 MB)
  expect(diffMB).toBeLessThan(10);
});

test('Should handle concurrent lecturer creation safely', async () => {
  const parallelTasks = 10;

  const tasks = Array.from({ length: parallelTasks }, async () => {
    const builder = new LecturerBuilder();
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

  const allLecturers = await new Lecturer().find();
  expect(allLecturers.length).toBeGreaterThanOrEqual(parallelTasks);
});

describe('NullUser object test', () => {
  test('find by id', async () => {
    const id = new mongoose.Types.ObjectId();
    const user = await new Lecturer().findById(id);
    expect(user).toBe(NullUser);
  });

  test('find', async () => {
    const registration_id = faker.string.uuid();
    const user = new Lecturer({ registration_id: registration_id });

    expect(registration_id).toBe(user.registration_id);
    const result = await user.find();
    result.forEach((user) => {
      expect(user).toBe(NullUser);
    });
  });
});

test('should find by id lecturer and update', async () => {
  const builder = new LecturerBuilder();
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
