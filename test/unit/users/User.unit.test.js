const { User, NullUser } = require('../../../src/classes/USERS');
const UserBuilder = require('../../../src/classes/USERS/UserBuilder');

const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const { config } = require('../../../src/config');
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
describe('Test User class', () => {
  const registration_id = faker.string.uuid();
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const full_name = faker.person.fullName();
  const with_initial = faker.person.fullName();

  const default_test_password = '123456';

  const address = {
    line1: faker.location.streetAddress({ useFullAddress: true }),
    line2: undefined,
    zip: faker.location.zipCode(),
  };
  const email = faker.internet.email().toLowerCase();

  test('Create new User', async () => {
    const builder = new UserBuilder();
    builder.registration_id = registration_id;
    builder.name = {
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      with_initial_name: with_initial,
    };
    builder.address = {
      line1: address.line1,
      line2: address.line2,
      zip: address.zip,
    };

    builder.email = email;
    builder.password = await PasswordHashService.hashPassword(
      default_test_password,
    );
    const result = await builder.create();

    expect(result.registration_id).toBe(registration_id);
    expect(result.name.first_name).toBe(first_name);
    expect(result.name.last_name).toBe(last_name);
    expect(result.name.full_name).toBe(full_name);
    expect(result.name.with_initial_name).toBe(with_initial);
  });

  test('Select created User', async () => {
    const user = new User();
    user.email = email;
    const find = await user.find({
      email: email,
    });
    expect(find.length).toBeGreaterThan(0);
    expect(email).toBe(find[0].email);
    expect(registration_id).toBe(find[0].registration_id);
    expect({
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      with_initial_name: with_initial,
    }).toStrictEqual(find[0].name);
    expect({
      line1: address.line1,
      zip: address.zip,
    }).toStrictEqual(find[0].address);
    const compare = await PasswordHashService.verifyPassword(
      default_test_password,
      find[0].password,
    );
    expect(compare).toBe(true);
  });
  const new_email = faker.internet.email().toLowerCase();
  test('Update selected User', async () => {
    const updateUser = await new User();
    updateUser.email = email;
    let users = await updateUser.find();
    expect(users.length).toBeGreaterThan(0);

    const user = users[0];

    //update user registration id
    const new_registration_id = faker.string.uuid();
    const new_name = {
      first_name: 'updated first name',
      last_name: 'updated last name',
      full_name: 'updated full name',
      with_initial_name: 'name with initial',
    };

    const new_password = '789555';

    user.registration_id = new_registration_id;
    user.name = new_name;
    user.email = new_email;
    user.password = new_password;
    user.deleted = true

    await user.save();

    users = await new User({ email: new_email }).find();

    expect(new_registration_id).toBe(users[0].registration_id);
    expect(new_name).toStrictEqual(users[0].name);
    expect(new_email).toBe(users[0].email);
    expect(new_password).toBe(users[0].password);
    expect(true).toBe(users[0].deleted)
  });

  test('Delete User', async () => {
    const deleted_user = await new User({
      email: new_email,
    }).deleteOne();
    expect(deleted_user.email).toBe(new_email);

    //create new user
    const builder = new UserBuilder();
    builder.registration_id = registration_id;
    builder.name = {
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      with_initial_name: with_initial,
    };
    builder.address = {
      line1: address.line1,
      line2: address.line2,
      zip: address.zip,
    };

    builder.email = faker.internet.email().toLowerCase();
    builder.password = await PasswordHashService.hashPassword(
      default_test_password,
    );
    const result = await builder.create();

    expect(result.registration_id).toBe(registration_id);
    expect(result.name.first_name).toBe(first_name);
    expect(result.name.last_name).toBe(last_name);
    expect(result.name.full_name).toBe(full_name);
    expect(result.name.with_initial_name).toBe(with_initial);

    //delete created user

    const deleted_user2 = await new User().deleteById(result.id);

    expect(deleted_user2.registration_id).toBe(registration_id);
    expect(deleted_user2.name.first_name).toBe(first_name);
    expect(deleted_user2.name.last_name).toBe(last_name);
    expect(deleted_user2.name.full_name).toBe(full_name);
    expect(deleted_user2.name.with_initial_name).toBe(with_initial);
  });

  describe('NullUser object test', () => {
    test('find by id', async () => {
      const id = new mongoose.Types.ObjectId();
      const user = await new User().findById(id);
      expect(user).toBe(NullUser);
    });

    test('find', async () => {
      const registration_id = faker.string.uuid();
      const user = new User({ registration_id: registration_id });

      expect(registration_id).toBe(user.registration_id);
      const result = await user.find();
      result.forEach((user) => {
        expect(user).toBe(NullUser);
      });
    });
  });
});
