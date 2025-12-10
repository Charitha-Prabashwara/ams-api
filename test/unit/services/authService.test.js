const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { faker } = require('@faker-js/faker');

const PasswordHashService = require('../../../src/services/PasswordHashService');
const { config, userTypes } = require('../../../src/config');
const {
  Admin,
  DepartmentHead,
  Lecturer,
  Student,
} = require('../../../src/classes/USERS');
const AdminBuilder = require('../../../src/classes/USERS/AdminBuilder');

const {
  AuthTokenServiceHelper,
  UserServiceHelper,
  PasswordHashServiceHelper,
  CookieServiceHelper,
} = require('../../../src/services/authServiceHelper');
const AuthTokenService = require('../../../src/services/authTokenService');
const UserService = require('../../../src/services/UserService');
const { AuthService } = require('../../../src/services/AuthService');
const CookieService = require('../../../src/services/cookieService');
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

describe('Auth Service - Admin', () => {
  let admin;
  let password;
  beforeAll(async () => {
    const defaultPassword = faker.internet.password(10);
    const registration_id = faker.string.uuid();
    const address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };
    const name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    const email = faker.internet.email().toLowerCase();

    const builder = new AdminBuilder();

    builder.registration_id = registration_id;
    builder.address = address;
    builder.name = name;
    builder.email = email;
    builder.password = await PasswordHashService.hashPassword(defaultPassword);

    const user = await builder.create();
    expect(user).toBeDefined();
    admin = user;
    password = defaultPassword;
  });

  test('should login', async () => {
    const service = new AuthService(
      new UserServiceHelper(new UserService()),
      new AuthTokenServiceHelper(AuthTokenService),
      new PasswordHashServiceHelper(PasswordHashService),
      new CookieServiceHelper(CookieService),
    );
    const response = await service.login(
      userTypes.USER_ADMIN,
      admin.email,
      password,
    );

    expect(response).toBeDefined();
    expect(response.user).toBeDefined();
    expect(response.tokens).toBeDefined();

    expect(response.user.id).toBeDefined();
    expect(response.user.name).toBeDefined();
    expect(response.user.type).toBeDefined();
    expect(response.user.email).toBeDefined();

    expect(response.tokens.access).toBeDefined();
    expect(response.cookie).toBeDefined();
  });

  test('should rest user password', async () => {
    const service = new AuthService(
      new UserServiceHelper(new UserService()),
      new AuthTokenServiceHelper(AuthTokenService),
      new PasswordHashServiceHelper(PasswordHashService),
      new CookieServiceHelper(CookieService),
    );
    const new_password = faker.internet.password(10);
    const isChanged = await service.passwordReset(
      userTypes.USER_ADMIN,
      admin.id,
      new_password,
    );

    expect(isChanged).toBe(true);

    const response = await service.login(
      userTypes.USER_ADMIN,
      admin.email,
      new_password,
    );

    expect(response).toBeDefined();
    expect(response.user).toBeDefined();
    expect(response.tokens).toBeDefined();

    expect(response.user.id).toBeDefined();
    expect(response.user.name).toBeDefined();
    expect(response.user.type).toBeDefined();
    expect(response.user.email).toBeDefined();

    expect(response.tokens.access).toBeDefined();
    expect(response.cookie).toBeDefined();
  });

  test('should handle incorrect credentials', async () => {
    const service = new AuthService(
      new UserServiceHelper(new UserService()),
      new AuthTokenServiceHelper(AuthTokenService),
      new PasswordHashServiceHelper(PasswordHashService),
      new CookieServiceHelper(CookieService),
    );
    await expect(
      service.login(
        userTypes.USER_ADMIN,
        faker.internet.email().toLowerCase(),
        password,
      ),
    ).rejects.toThrow('Invalid Credentials');

    await expect(
      service.login(
        userTypes.USER_ADMIN,
        admin.email,
        faker.internet.password(10),
      ),
    ).rejects.toThrow('Invalid Credentials');
  });
});

const { LogoutFailed } = require('../../../src/errors');

const { Types } = require('mongoose');

describe('Auth Service - Admin Logout (Integration)', () => {
  let admin;
  let password;
  let service;

  beforeAll(async () => {
    // Create admin user
    const defaultPassword = faker.internet.password(10);
    const registration_id = faker.string.uuid();
    const address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };
    const name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    const email = faker.internet.email().toLowerCase();

    const builder = new AdminBuilder();
    builder.registration_id = registration_id;
    builder.address = address;
    builder.name = name;
    builder.email = email;
    builder.password = await PasswordHashService.hashPassword(defaultPassword);

    admin = await builder.create();
    password = defaultPassword;

    service = new AuthService(
      new UserServiceHelper(new UserService()),
      new AuthTokenServiceHelper(AuthTokenService),
      new PasswordHashServiceHelper(PasswordHashService),
      new CookieServiceHelper(CookieService),
    );
  });

  test('should logout successfully with real ObjectId', async () => {
    // login first
    const loginResponse = await service.login(
      userTypes.USER_ADMIN,
      admin.email,
      password,
    );
    expect(loginResponse.tokens.access).toBeDefined();
    expect(loginResponse.cookie).toBeDefined();

    // logout using real ObjectId
    const logoutResponse = await service.logOut(
      userTypes.USER_ADMIN,
      new Types.ObjectId(admin.id),
    );

    expect(logoutResponse).toBeDefined();
    expect(logoutResponse.cookie).toBeDefined();
    expect(typeof logoutResponse.cookie).toBe('string');

    // verify DB tokens cleared
    const updatedUser = await new UserService().getUserById(
      userTypes.USER_ADMIN,
      admin.id,
    );
    expect(updatedUser.access_token).toBeNull();
    expect(updatedUser.refresh_token).toBeNull();
  });

  test('should fail logout if user does not exist', async () => {
    const fakeId = new Types.ObjectId(); // real ObjectId, but not in DB
    await expect(service.logOut(userTypes.USER_ADMIN, fakeId)).rejects.toThrow(
      'Logout failed',
    );
  });

  test('should fail logout if user is suspended', async () => {
    // suspend admin temporarily
    admin.enable_state = false;
    await new UserService().findByIdAndUpdate(userTypes.USER_ADMIN, admin);

    await expect(
      service.logOut(userTypes.USER_ADMIN, new Types.ObjectId(admin.id)),
    ).rejects.toThrow('Logout failed');

    // unsuspend for further tests
    admin.suspended = false;
    await new UserService().findByIdAndUpdate(userTypes.USER_ADMIN, admin);
  });
});
