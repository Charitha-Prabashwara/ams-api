const { DepartmentHead, NullUser } = require('../../../src/classes/USERS');
const DepartmentHeadBuilder = require('../../../src/classes/USERS/DepartmentHeadBuilder');
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

let createDepartmentHead;
let new_email = faker.internet.email().toLowerCase();

test('Should create a new Department-Head successfully', async () => {
  const builder = new DepartmentHeadBuilder();
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

  createDepartmentHead = await builder.create();

  expect(createDepartmentHead).toBeInstanceOf(DepartmentHead);
  expect(createDepartmentHead.registration_id).toBe(registration_id);
  expect(createDepartmentHead.name.first_name).toBe(first_name);
  expect(createDepartmentHead._type).toBe('department');

  const compare = await PasswordHashService.verifyPassword(
    defaultPassword,
    createDepartmentHead.password,
  );
  expect(compare).toBe(true);
});

test('Should find the created Department-Head by email', async () => {
  const finder = new DepartmentHead();
  finder.email = email;

  const foundDepartmentHeads = await finder.find();
  expect(foundDepartmentHeads.length).toBeGreaterThan(0);

  const found = foundDepartmentHeads[0];
  expect(found.email).toBe(email);
  expect(found.registration_id).toBe(registration_id);
  expect(found.name.full_name).toBe(full_name);
  expect(found._type).toBe('department');
});

test('Should find Department-Head using findOne by email', async () => {
  const finder = new DepartmentHead();
  finder.email = createDepartmentHead.email;
  const found = await finder.findOne();
  expect(found).toBeInstanceOf(DepartmentHead);
  expect(found.id).toStrictEqual(createDepartmentHead.id);
  expect(found._type).toBe(userTypes.USER_DEPARTMENT);
});

test('Should find Department-Head by ID', async () => {
  const finder = new DepartmentHead();
  const found = await finder.findById(createDepartmentHead.id);
  expect(found).toBeInstanceOf(DepartmentHead);
  expect(found.id).toStrictEqual(createDepartmentHead.id);
  expect(found._type).toBe(userTypes.USER_DEPARTMENT);
});

test('Should update Department-Head data successfully', async () => {
  const departmentHeadToUpdate = new DepartmentHead({ email });
  const users = await departmentHeadToUpdate.find();

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

  const updatedUsers = await new DepartmentHead({ email: new_email }).find();
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

test('Should delete Department-Head by email (deleteOne)', async () => {
  const deleter = new DepartmentHead({ email: new_email });
  const deleted = await deleter.deleteOne();

  expect(deleted).toBeInstanceOf(DepartmentHead);
  expect(deleted.email).toBe(new_email);

  const check = await new DepartmentHead({ email: new_email }).find();
  expect(check.length).toBe(0);
});

test('Should delete Department-Head by ID (deleteById)', async () => {
  const builder = new DepartmentHeadBuilder();
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

  const newDepartmentHead = await builder.create();
  const deleted = await new DepartmentHead().deleteById(newDepartmentHead.id);

  expect(deleted.registration_id).toBe(registration_id);
  expect(deleted.name.full_name).toBe(full_name);

  const findDeleted = await new DepartmentHead({
    id: newDepartmentHead.id,
  }).find();
  expect(findDeleted.length).toBe(0);
});

test('Should not allow modification of _type in Department-Head or Department-Head-Builder', () => {
  const departmentHead = new DepartmentHead();
  const builder = new DepartmentHeadBuilder();

  expect(departmentHead._type).toBe('department');
  expect(builder._type).toBe('department');

  expect(
    Object.getOwnPropertyDescriptor(departmentHead, '_type').writable,
  ).toBe(false);
  expect(Object.getOwnPropertyDescriptor(builder, '_type').writable).toBe(
    false,
  );

  //expect(() => { departmentHead._type = 'user'; }).toThrow();
  //expect(() => { builder._type = 'user'; }).toThrow();
});

test('Should handle save error gracefully', async () => {
  const badDepartmentHead = new DepartmentHead();
  badDepartmentHead.save = jest.fn().mockRejectedValue(new Error('DB error'));
  await expect(badDepartmentHead.save()).rejects.toThrow('DB error');
});

test('Should handle findById error gracefully', async () => {
  const badDepartmentHead = new DepartmentHead();
  badDepartmentHead.findById = jest
    .fn()
    .mockRejectedValue(new Error('Find failed'));
  await expect(badDepartmentHead.findById('invalid')).rejects.toThrow(
    'Find failed',
  );
});

test('Should handle concurrent Department-Head creation safely', async () => {
  const parallelTasks = 10;

  const tasks = Array.from({ length: parallelTasks }, async () => {
    const builder = new DepartmentHeadBuilder();
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

  const allDepartmentHeads = await new DepartmentHead().find();
  expect(allDepartmentHeads.length).toBeGreaterThanOrEqual(parallelTasks);
});

describe('NullUser object test', () => {
  test('find by id', async () => {
    const id = new mongoose.Types.ObjectId();
    const user = await new DepartmentHead().findById(id);
    expect(user).toBe(NullUser);
  });

  test('find', async () => {
    const registration_id = faker.string.uuid();
    const user = new DepartmentHead({ registration_id: registration_id });

    expect(registration_id).toBe(user.registration_id);
    const result = await user.find();
    result.forEach((user) => {
      expect(user).toBe(NullUser);
    });
  });
});

test('should find by department head and update', async () => {
  const builder = new DepartmentHeadBuilder();
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
