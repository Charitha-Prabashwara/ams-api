const {
  Admin,
  NullUser,
  DepartmentHead,
  Lecturer,
  Student,
} = require('../../../src/classes/USERS');
const AdminBuilder = require('../../../src/classes/USERS/AdminBuilder');
const DepartmentHeadBuilder = require('../../../src/classes/USERS/DepartmentHeadBuilder');
const LecturerBuilder = require('../../../src/classes/USERS/LecturerBuilder');
const StudentBuilder = require('./../../../src/classes/USERS/StudentBuilder');
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

let adminBuilders = [];
let adminPasswords = [];

let departmentHeadBuilder = [];
let departmentHeadPasswords = [];

let lecturerBuilders = [];
let lecturerPasswords = [];

let studentBuilders = [];
let studentPasswords = [];
describe('Create Admins, departmentHeads, Lecturers, Students', () => {
  beforeAll(async () => {
    const tempAdminBuilders = [];
    const tempAdminPasswords = [];

    const tempDepartmentHeadBuilders = [];
    const tempDepartmentHeadPasswords = [];

    const tempLecturerBuilders = [];
    const tempLecturerPasswords = [];

    const tempStudentBuilders = [];
    const tempStudentPasswords = [];

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

      tempAdminBuilders.push(builder);
      tempAdminPasswords.push(defaultPassword);
    }

    for (let i = 0; i < 30; i++) {
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
      builder.password =
        await PasswordHashService.hashPassword(defaultPassword);

      tempDepartmentHeadBuilders.push(builder);
      tempDepartmentHeadPasswords.push(defaultPassword);
    }

    for (let i = 0; i < 30; i++) {
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
      builder.password =
        await PasswordHashService.hashPassword(defaultPassword);

      tempLecturerBuilders.push(builder);
      tempLecturerPasswords.push(defaultPassword);
    }

    for (let i = 0; i < 30; i++) {
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
      builder.password =
        await PasswordHashService.hashPassword(defaultPassword);

      tempStudentBuilders.push(builder);
      tempStudentPasswords.push(defaultPassword);
    }

    adminBuilders = tempAdminBuilders;
    adminPasswords = tempAdminPasswords;

    departmentHeadBuilder = tempDepartmentHeadBuilders;
    departmentHeadPasswords = tempDepartmentHeadPasswords;

    lecturerBuilders = tempLecturerBuilders;
    lecturerPasswords = tempLecturerPasswords;

    studentBuilders = tempStudentBuilders;
    studentPasswords = tempStudentPasswords;
  }, 20000);

  test('should create and verify all admins', async () => {
    for (let i = 0; i < adminBuilders.length; i++) {
      const builder = adminBuilders[i];
      const password = adminPasswords[i];

      const user = await builder.create();
      expect(user).toBeDefined();
      expect(user.email).toBe(builder.email);
      expect(
        await PasswordHashService.verifyPassword(password, user.password),
      ).toBe(true);
    }

    for (let i = 0; i < departmentHeadBuilder.length; i++) {
      const builder = departmentHeadBuilder[i];
      const password = departmentHeadPasswords[i];

      const user = await builder.create();
      expect(user).toBeDefined();
      expect(user.email).toBe(builder.email);
      expect(
        await PasswordHashService.verifyPassword(password, user.password),
      ).toBe(true);
    }

    for (let i = 0; i < lecturerBuilders.length; i++) {
      const builder = lecturerBuilders[i];
      const password = lecturerPasswords[i];

      const user = await builder.create();
      expect(user).toBeDefined();
      expect(user.email).toBe(builder.email);
      expect(
        await PasswordHashService.verifyPassword(password, user.password),
      ).toBe(true);
    }

    for (let i = 0; i < studentBuilders.length; i++) {
      const builder = studentBuilders[i];
      const password = studentPasswords[i];

      const user = await builder.create();
      expect(user).toBeDefined();
      expect(user.email).toBe(builder.email);
      expect(
        await PasswordHashService.verifyPassword(password, user.password),
      ).toBe(true);
    }
  }, 20000);

  test('should always find right user type and right user', async () => {
    const builders = adminBuilders.concat(
      departmentHeadBuilder,
      lecturerBuilders,
      studentBuilders,
    );

    for (let index = 0; index < 100; index++) {
      const randomBuilder =
        builders[Math.floor(Math.random() * builders.length)];

      expect(randomBuilder).toBeDefined();

      const email = randomBuilder.email;
      expect(email).toBeDefined();
      const userType = randomBuilder._type;
      expect(userType).toBeDefined();

      const selectUserClass = (userType) => {
        if (userType == userTypes.USER_ADMIN) return new Admin();
        if (userType == userTypes.USER_DEPARTMENT) return new DepartmentHead();
        if (userType == userTypes.USER_LECTURER) return new Lecturer();
        if (userType == userTypes.USER_STUDENT) return new Student();
      };

      const user = selectUserClass(userType);
      expect(user).toBeDefined();

      user.email = randomBuilder.email;
      const result = await user.findOne();
      expect(result._type).toBe(userType);

      const randomBuilder2 =
        builders[Math.floor(Math.random() * builders.length)];

      const randomUserType = (userType) => {
        let types = [];
        if (userType == userTypes.USER_ADMIN) {
          types = [new DepartmentHead(), new Lecturer(), new Student()];
        }

        if (userType == userTypes.USER_DEPARTMENT) {
          types = [new Admin(), new Lecturer(), new Student()];
        }

        if (userType == userTypes.USER_LECTURER) {
          types = [new Admin(), new DepartmentHead(), new Student()];
        }

        if (userType == userTypes.USER_STUDENT) {
          types = [new Admin(), new DepartmentHead(), new Lecturer()];
        }

        return types[Math.floor(Math.random() * types.length)];
      };

      const randomUser = randomUserType(userType);
      randomUser.email = result.email;
      const result2 = await randomUser.findOne();

      expect(result2).toBe(NullUser);
      expect(result2.email).not.toBe(result.email);
    }
  }, 20000);
});
