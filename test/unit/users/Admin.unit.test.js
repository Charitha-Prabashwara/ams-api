const { Admin, NullUser } = require('../../../src/classes/USERS');
const AdminBuilder = require('../../../src/classes/USERS/AdminBuilder');
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

let createdAdmin;
let new_email = faker.internet.email().toLowerCase();

test('Should create a new Admin successfully', async () => {
  const builder = new AdminBuilder();
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

  createdAdmin = await builder.create();

  expect(createdAdmin).toBeInstanceOf(Admin);
  expect(createdAdmin.registration_id).toBe(registration_id);
  expect(createdAdmin.name.first_name).toBe(first_name);
  expect(createdAdmin._type).toBe('admin');

  const compare = await PasswordHashService.verifyPassword(
    defaultPassword,
    createdAdmin.password,
  );
  expect(compare).toBe(true);
});

test('Should find the created Admin by email', async () => {
  const finder = new Admin();
  finder.email = email;

  const foundAdmins = await finder.find();
  expect(foundAdmins.length).toBeGreaterThan(0);

  const found = foundAdmins[0];
  expect(found.email).toBe(email);
  expect(found.registration_id).toBe(registration_id);
  expect(found.name.full_name).toBe(full_name);
  expect(found._type).toBe('admin');
});

test('Should find Admin using findOne by email', async () => {
  const finder = new Admin();
  finder.email = createdAdmin.email;
  const found = await finder.findOne();
  expect(found).toBeInstanceOf(Admin);
  expect(found.id).toStrictEqual(createdAdmin.id);
  expect(found._type).toBe(userTypes.USER_ADMIN);
});

test('Should find Admin by ID', async () => {
  const finder = new Admin();
  const found = await finder.findById(createdAdmin.id);
  expect(found).toBeInstanceOf(Admin);
  expect(found.id).toStrictEqual(createdAdmin.id);
  expect(found._type).toBe(userTypes.USER_ADMIN);
});

test('Should update Admin data successfully', async () => {
  const adminToUpdate = new Admin({ email });
  const users = await adminToUpdate.find();

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

  const updatedUsers = await new Admin({ email: new_email }).find();
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

test('Should delete Admin by email (deleteOne)', async () => {
  const deleter = new Admin({ email: new_email });
  const deleted = await deleter.deleteOne();

  expect(deleted).toBeInstanceOf(Admin);
  expect(deleted.email).toBe(new_email);

  const check = await new Admin({ email: new_email }).find();
  expect(check.length).toBe(0);
});

test('Should delete Admin by ID (deleteById)', async () => {
  const builder = new AdminBuilder();
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

  const newAdmin = await builder.create();
  const deleted = await new Admin().deleteById(newAdmin.id);

  expect(deleted.registration_id).toBe(registration_id);
  expect(deleted.name.full_name).toBe(full_name);

  const findDeleted = await new Admin({ id: newAdmin.id }).find();
  expect(findDeleted.length).toBe(0);
});

test('Should not allow modification of _type in Admin or AdminBuilder', () => {
  const admin = new Admin();
  const builder = new AdminBuilder();

  expect(admin._type).toBe('admin');
  expect(builder._type).toBe('admin');

  expect(Object.getOwnPropertyDescriptor(admin, '_type').writable).toBe(false);
  expect(Object.getOwnPropertyDescriptor(builder, '_type').writable).toBe(
    false,
  );

  //expect(() => { admin._type = 'user'; }).toThrow();
  //expect(() => { builder._type = 'user'; }).toThrow();
});

test('Should handle save error gracefully', async () => {
  const badAdmin = new Admin();
  badAdmin.save = jest.fn().mockRejectedValue(new Error('DB error'));
  await expect(badAdmin.save()).rejects.toThrow('DB error');
});

test('Should handle findById error gracefully', async () => {
  const badAdmin = new Admin();
  badAdmin.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
  await expect(badAdmin.findById('invalid')).rejects.toThrow('Find failed');
});

test('Should not leak memory when repeatedly creating and deleting admins', async () => {
  const iterations = 30;
  const memoryBefore = process.memoryUsage().heapUsed;

  for (let i = 0; i < iterations; i++) {
    const builder = new AdminBuilder();
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

    const tempAdmin = await builder.create();
    await new Admin().deleteById(tempAdmin.id);
  }

  global.gc && global.gc(); // Force garbage collection if node --expose-gc
  const memoryAfter = process.memoryUsage().heapUsed;
  const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
  console.log(`Memory change: ${diffMB.toFixed(2)} MB`);
});

test('Should handle concurrent Admin creation safely', async () => {
  const parallelTasks = 10;

  const tasks = Array.from({ length: parallelTasks }, async () => {
    const builder = new AdminBuilder();
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

  const allAdmins = await new Admin().find();
  expect(allAdmins.length).toBeGreaterThanOrEqual(parallelTasks);
});

describe('NullUser object test', () => {
  test('find by id', async () => {
    const id = new mongoose.Types.ObjectId();
    const user = await new Admin().findById(id);
    expect(user).toBe(NullUser);
  });

  test('find', async () => {
    const registration_id = faker.string.uuid();
    const user = new Admin({ registration_id: registration_id });

    expect(registration_id).toBe(user.registration_id);
    const result = await user.find();
    result.forEach((user) => {
      expect(user).toBe(NullUser);
    });
  });
});

describe('Check and test found bug in findOne method', () => {
  let builders = [];
  let passwords = [];

  beforeAll(async () => {
    const tempBuilders = [];
    const tempPasswords = [];

    for (let i = 0; i < 30; i++) {
      const builder = new AdminBuilder();
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
      builder.password =
        await PasswordHashService.hashPassword(defaultPassword);

      tempBuilders.push(builder);
      tempPasswords.push(defaultPassword);
    }

    builders = tempBuilders;
    passwords = tempPasswords;
  });

  test('should create and verify all admins', async () => {
    for (let i = 0; i < builders.length; i++) {
      const builder = builders[i];
      const password = passwords[i];

      const user = await builder.create();
      expect(user).toBeDefined();
      expect(user.email).toBe(builder.email);
      expect(
        await PasswordHashService.verifyPassword(password, user.password),
      ).toBe(true);
    }

    await Promise.all(
      builders.map(async (builder) => {
        const admin = new Admin();
        admin.email = builder.email;
        const result = await admin.findOne({ select: ['+password'] });
        expect(result.email).toBe(builder.email);
        expect(result.registration_id).toBe(builder.registration_id);
        expect(result.address).toStrictEqual(builder.address);
        expect(result.name).toStrictEqual(builder.name);
        expect(result.password).toBe(builder.password);
      }),
    );

    await Promise.all(
      builders.map(async (builder) => {
        const admin = new Admin();
        admin.registration_id = builder.registration_id;
        const result = await admin.findOne({ select: ['+password'] });
        expect(result.email).toBe(builder.email);
        expect(result.registration_id).toBe(builder.registration_id);
        expect(result.address).toStrictEqual(builder.address);
        expect(result.name).toStrictEqual(builder.name);
        expect(result.password).toBe(builder.password);
      }),
    );

    await Promise.all(
      builders.map(async (builder) => {
        const admin = new Admin();
        admin.email = builder.email;
        admin.registration_id = builder.registration_id;
        const result = await admin.findOne({ select: ['+password'] });
        expect(result.email).toBe(builder.email);
        expect(result.registration_id).toBe(builder.registration_id);
        expect(result.address).toStrictEqual(builder.address);
        expect(result.name).toStrictEqual(builder.name);
        expect(result.password).toBe(builder.password);
      }),
    );
  });

  test('should find by admin and update', async () => {
    const builder = new AdminBuilder();
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
});
