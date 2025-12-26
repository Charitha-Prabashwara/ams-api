const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { faker } = require('@faker-js/faker');

const {
  Admin,
  DepartmentHead,
  Lecturer,
  Student,
} = require('../../../src/classes/USERS');
const AdminBuilder = require('../../../src/classes/USERS/AdminBuilder');
const PasswordHashService = require('../../../src/services/PasswordHashService');
const { config, userTypes } = require('../../../src/config');

const UserService = require('../../../src/services/UserService');

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

describe('userService test', () => {
  let adminBuilders = [];
  let adminPasswords = [];
  let adminUsers = [];

  beforeAll(async () => {
    const tempBuilders = [];
    const tempPasswords = [];

    // Create fake admin builders and users
    for (let i = 0; i < 5; i++) {
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

    adminBuilders = tempBuilders;
    adminPasswords = tempPasswords;

    // Create actual Admin users
    for (const builder of adminBuilders) {
      const user = await builder.create();
      adminUsers.push(user);
    }

    // ensure we have data
    expect(adminUsers.length).toBeGreaterThan(0);
  });

  test('all created users should be valid', async () => {
    for (const user of adminUsers) {
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
    }
  });

  test('should find each user by ID from database', async () => {
    for (const user of adminUsers) {
      const service = new UserService();
      const found = await service.getUserById(userTypes.USER_ADMIN, user.id);

      expect(found).toBeDefined();
      expect(found).toBeInstanceOf(Admin);
      expect(found._type).toBe(userTypes.USER_ADMIN);
      expect(found.email).toBe(user.email);
    }
  });

  test('should find each user by registration id from database', async () => {
    for (const user of adminUsers) {
      const service = new UserService();
      const found = await service.getUserByRegistrationId(
        userTypes.USER_ADMIN,
        user.registration_id,
      );

      expect(found).toBeDefined();
      expect(found.registration_id).toBeDefined();
      expect(found).toBeInstanceOf(Admin);
      expect(found._type).toBe(userTypes.USER_ADMIN);
      expect(found.email).toBe(user.email);
    }
  });

  test('should find each user by email id from database', async () => {
    for (const user of adminUsers) {
      const service = new UserService();
      const found = await service.getUserByEmail(
        userTypes.USER_ADMIN,
        user.email,
      );

      expect(found).toBeDefined();
      expect(found).toBeInstanceOf(Admin);
      expect(found._type).toBe(userTypes.USER_ADMIN);
      expect(found.email).toBe(user.email);
    }
  });

  test('should find each user from database', async () => {
    for (const user of adminUsers) {
      const service = new UserService();
      const found_users = await service.getFindUsers(
        userTypes.USER_ADMIN,
        user,
      );
      found_users.forEach((found) => {
        expect(found).toBeDefined();
        expect(found).toBeInstanceOf(Admin);
      });
    }
  });

  test('should create new Admin users using userService', async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );

    const service = new UserService();
    const user = await service.createNewUser(userTypes.USER_ADMIN, data);

    expect(user).toBeDefined();
    expect(user.registration_id).toBe(data.registration_id);
    expect(user.address).toStrictEqual(data.address);
    expect(user.name).toStrictEqual(data.name);
    expect(user.email).toBe(data.email);
    expect(user).toBeInstanceOf(Admin);
    expect(user._type).toBe(userTypes.USER_ADMIN);
  });

  test('should create new DepartmentHead users using userService', async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );

    const service = new UserService();
    const user = await service.createNewUser(userTypes.USER_DEPARTMENT, data);

    expect(user).toBeDefined();
    expect(user.registration_id).toBe(data.registration_id);
    expect(user.address).toStrictEqual(data.address);
    expect(user.name).toStrictEqual(data.name);
    expect(user.email).toBe(data.email);
    expect(user).toBeInstanceOf(DepartmentHead);
    expect(user._type).toBe(userTypes.USER_DEPARTMENT);
  });

  test('should create new Lecturer users using userService', async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );

    const service = new UserService();
    const user = await service.createNewUser(userTypes.USER_LECTURER, data);

    expect(user).toBeDefined();
    expect(user.registration_id).toBe(data.registration_id);
    expect(user.address).toStrictEqual(data.address);
    expect(user.name).toStrictEqual(data.name);
    expect(user.email).toBe(data.email);
    expect(user).toBeInstanceOf(Lecturer);
    expect(user._type).toBe(userTypes.USER_LECTURER);
  });

  test('should create new Student users using userService', async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );

    const service = new UserService();
    const user = await service.createNewUser(userTypes.USER_STUDENT, data);

    expect(user).toBeDefined();
    expect(user.registration_id).toBe(data.registration_id);
    expect(user.address).toStrictEqual(data.address);
    expect(user.name).toStrictEqual(data.name);
    expect(user.email).toBe(data.email);
    expect(user).toBeInstanceOf(Student);
    expect(user._type).toBe(userTypes.USER_STUDENT);
  });

  test('should delete student by id suing userService', async () => {
    const dataGen = async () => {
      const data = {};
      data.registration_id = faker.string.uuid();
      data.address = {
        line1: faker.location.streetAddress({ useFullAddress: true }),
        line2: faker.location.streetAddress({ useFullAddress: true }),
        zip: faker.location.zipCode(),
      };

      data.email = faker.internet.email().toLowerCase();
      data.name = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        full_name: faker.person.fullName(),
        with_initial_name: faker.person.fullName(),
      };
      data.password = await PasswordHashService.hashPassword(
        faker.internet.password(10),
      );
      return data;
    };

    const service = new UserService();

    const adminData = await dataGen();
    const departmentHeadData = await dataGen();
    const lecturerData = await dataGen();
    const studentData = await dataGen();

    const admin = await service.createNewUser(userTypes.USER_ADMIN, adminData);
    const departmentHead = await service.createNewUser(
      userTypes.USER_DEPARTMENT,
      departmentHeadData,
    );
    const lecturer = await service.createNewUser(
      userTypes.USER_LECTURER,
      lecturerData,
    );
    const student = await service.createNewUser(
      userTypes.USER_STUDENT,
      studentData,
    );

    expect(admin).toBeDefined();
    expect(admin.registration_id).toBe(adminData.registration_id);
    expect(admin.address).toStrictEqual(adminData.address);
    expect(admin.name).toStrictEqual(adminData.name);
    expect(admin.email).toBe(adminData.email);
    expect(admin).toBeInstanceOf(Admin);
    expect(admin._type).toBe(userTypes.USER_ADMIN);

    expect(departmentHead).toBeDefined();
    expect(departmentHead.registration_id).toBe(
      departmentHeadData.registration_id,
    );
    expect(departmentHead.address).toStrictEqual(departmentHeadData.address);
    expect(departmentHead.name).toStrictEqual(departmentHeadData.name);
    expect(departmentHead.email).toBe(departmentHeadData.email);
    expect(departmentHead).toBeInstanceOf(DepartmentHead);
    expect(departmentHead._type).toBe(userTypes.USER_DEPARTMENT);

    expect(lecturer).toBeDefined();
    expect(lecturer.registration_id).toBe(lecturerData.registration_id);
    expect(lecturer.address).toStrictEqual(lecturerData.address);
    expect(lecturer.name).toStrictEqual(lecturerData.name);
    expect(lecturer.email).toBe(lecturerData.email);
    expect(lecturer).toBeInstanceOf(Lecturer);
    expect(lecturer._type).toBe(userTypes.USER_LECTURER);

    expect(student).toBeDefined();
    expect(student.registration_id).toBe(studentData.registration_id);
    expect(student.address).toStrictEqual(studentData.address);
    expect(student.name).toStrictEqual(studentData.name);
    expect(student.email).toBe(studentData.email);
    expect(student).toBeInstanceOf(Student);
    expect(student._type).toBe(userTypes.USER_STUDENT);

    const deletedAdmin = await service.deleteUserById(
      userTypes.USER_ADMIN,
      admin.id,
    );
    const deletedDepartmentHead = await service.deleteUserById(
      userTypes.USER_DEPARTMENT,
      departmentHead.id,
    );
    const deletedLecturer = await service.deleteUserById(
      userTypes.USER_LECTURER,
      lecturer.id,
    );
    const deletedStudent = await service.deleteUserById(
      userTypes.USER_STUDENT,
      student.id,
    );

    expect(deletedAdmin).toBeDefined();
    expect(deletedDepartmentHead).toBeDefined();
    expect(deletedLecturer).toBeDefined();
    expect(deletedStudent).toBeDefined();

    expect(deletedAdmin.registration_id).toBe(adminData.registration_id);
    expect(deletedDepartmentHead.registration_id).toBe(
      departmentHeadData.registration_id,
    );
    expect(deletedLecturer.registration_id).toBe(lecturerData.registration_id);
    expect(deletedStudent.registration_id).toBe(studentData.registration_id);

    expect(deletedAdmin.address).toStrictEqual(adminData.address);
    expect(deletedDepartmentHead.address).toStrictEqual(
      departmentHeadData.address,
    );
    expect(deletedLecturer.address).toStrictEqual(lecturerData.address);
    expect(deletedStudent.address).toStrictEqual(studentData.address);

    expect(deletedAdmin.name).toStrictEqual(adminData.name);
    expect(deletedDepartmentHead.name).toStrictEqual(departmentHeadData.name);
    expect(deletedLecturer.name).toStrictEqual(lecturerData.name);
    expect(deletedStudent.name).toStrictEqual(studentData.name);

    expect(deletedAdmin.email).toBe(adminData.email);
    expect(deletedDepartmentHead.email).toBe(deletedDepartmentHead.email);
    expect(deletedLecturer.email).toBe(lecturerData.email);
    expect(deletedStudent.email).toBe(studentData.email);

    expect(deletedAdmin).toBeInstanceOf(Admin);
    expect(deletedDepartmentHead).toBeInstanceOf(DepartmentHead);
    expect(deletedLecturer).toBeInstanceOf(Lecturer);
    expect(deletedStudent).toBeInstanceOf(Student);

    expect(deletedAdmin._type).toBe(userTypes.USER_ADMIN);
    expect(deletedDepartmentHead._type).toBe(userTypes.USER_DEPARTMENT);
    expect(deletedLecturer._type).toBe(userTypes.USER_LECTURER);
    expect(deletedStudent._type).toBe(userTypes.USER_STUDENT);
  });
});

test('should update Admin by id suing userService', async () => {
  const dataGen = async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );
    return data;
  };

  const service = new UserService();

  const adminData = await dataGen();
  const departmentHeadData = await dataGen();
  const lecturerData = await dataGen();
  const studentData = await dataGen();

  const admin = await service.createNewUser(userTypes.USER_ADMIN, adminData);
  const departmentHead = await service.createNewUser(
    userTypes.USER_DEPARTMENT,
    departmentHeadData,
  );
  const lecturer = await service.createNewUser(
    userTypes.USER_LECTURER,
    lecturerData,
  );
  const student = await service.createNewUser(
    userTypes.USER_STUDENT,
    studentData,
  );

  expect(admin).toBeDefined();
  expect(admin.registration_id).toBe(adminData.registration_id);
  expect(admin.address).toStrictEqual(adminData.address);
  expect(admin.name).toStrictEqual(adminData.name);
  expect(admin.email).toBe(adminData.email);
  expect(admin).toBeInstanceOf(Admin);
  expect(admin._type).toBe(userTypes.USER_ADMIN);

  expect(departmentHead).toBeDefined();
  expect(departmentHead.registration_id).toBe(
    departmentHeadData.registration_id,
  );
  expect(departmentHead.address).toStrictEqual(departmentHeadData.address);
  expect(departmentHead.name).toStrictEqual(departmentHeadData.name);
  expect(departmentHead.email).toBe(departmentHeadData.email);
  expect(departmentHead).toBeInstanceOf(DepartmentHead);
  expect(departmentHead._type).toBe(userTypes.USER_DEPARTMENT);

  expect(lecturer).toBeDefined();
  expect(lecturer.registration_id).toBe(lecturerData.registration_id);
  expect(lecturer.address).toStrictEqual(lecturerData.address);
  expect(lecturer.name).toStrictEqual(lecturerData.name);
  expect(lecturer.email).toBe(lecturerData.email);
  expect(lecturer).toBeInstanceOf(Lecturer);
  expect(lecturer._type).toBe(userTypes.USER_LECTURER);

  expect(student).toBeDefined();
  expect(student.registration_id).toBe(studentData.registration_id);
  expect(student.address).toStrictEqual(studentData.address);
  expect(student.name).toStrictEqual(studentData.name);
  expect(student.email).toBe(studentData.email);
  expect(student).toBeInstanceOf(Student);
  expect(student._type).toBe(userTypes.USER_STUDENT);

  const new_adminEmail = faker.internet.email().toLowerCase();
  const new_departmentHeadEmail = faker.internet.email().toLowerCase();
  const new_lecturerEmail = faker.internet.email().toLowerCase();
  const new_studentEmail = faker.internet.email().toLowerCase();

  admin.email = new_adminEmail;
  departmentHead.email = new_departmentHeadEmail;
  lecturer.email = new_lecturerEmail;
  student.email = new_studentEmail;

  const updatedAdmin = await service.findByIdAndUpdate(
    userTypes.USER_ADMIN,
    admin,
  );
  const updatedDepartmentHead = await service.findByIdAndUpdate(
    userTypes.USER_DEPARTMENT,
    departmentHead,
  );
  const updatedLecturer = await service.findByIdAndUpdate(
    userTypes.USER_LECTURER,
    lecturer,
  );
  const updatedStudent = await service.findByIdAndUpdate(
    userTypes.USER_STUDENT,
    student,
  );

  expect(updatedAdmin).toBeDefined();
  expect(updatedDepartmentHead).toBeDefined();
  expect(updatedLecturer).toBeDefined();
  expect(updatedStudent).toBeDefined();

  expect(updatedAdmin.registration_id).toBe(adminData.registration_id);
  expect(updatedDepartmentHead.registration_id).toBe(
    departmentHeadData.registration_id,
  );
  expect(updatedLecturer.registration_id).toBe(lecturerData.registration_id);
  expect(updatedStudent.registration_id).toBe(studentData.registration_id);

  expect(updatedAdmin.address).toStrictEqual(adminData.address);
  expect(updatedDepartmentHead.address).toStrictEqual(
    departmentHeadData.address,
  );
  expect(updatedLecturer.address).toStrictEqual(lecturerData.address);
  expect(updatedStudent.address).toStrictEqual(studentData.address);

  expect(updatedAdmin.name).toStrictEqual(adminData.name);
  expect(updatedDepartmentHead.name).toStrictEqual(departmentHeadData.name);
  expect(updatedLecturer.name).toStrictEqual(lecturerData.name);
  expect(updatedStudent.name).toStrictEqual(studentData.name);

  expect(updatedAdmin.email).toBe(new_adminEmail);
  expect(updatedDepartmentHead.email).toBe(new_departmentHeadEmail);
  expect(updatedLecturer.email).toBe(new_lecturerEmail);
  expect(updatedStudent.email).toBe(new_studentEmail);

  expect(updatedAdmin).toBeInstanceOf(Admin);
  expect(updatedDepartmentHead).toBeInstanceOf(DepartmentHead);
  expect(updatedLecturer).toBeInstanceOf(Lecturer);
  expect(updatedStudent).toBeInstanceOf(Student);

  expect(updatedAdmin._type).toBe(userTypes.USER_ADMIN);
  expect(updatedDepartmentHead._type).toBe(userTypes.USER_DEPARTMENT);
  expect(updatedLecturer._type).toBe(userTypes.USER_LECTURER);
  expect(updatedStudent._type).toBe(userTypes.USER_STUDENT);
});

const create_users = [];
test('should set suspend state by id userService', async () => {
  const dataGen = async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );
    return data;
  };

  const service = new UserService();

  const adminData = await dataGen();
  const departmentHeadData = await dataGen();
  const lecturerData = await dataGen();
  const studentData = await dataGen();

  const admin = await service.createNewUser(userTypes.USER_ADMIN, adminData);
  const departmentHead = await service.createNewUser(
    userTypes.USER_DEPARTMENT,
    departmentHeadData,
  );
  const lecturer = await service.createNewUser(
    userTypes.USER_LECTURER,
    lecturerData,
  );
  const student = await service.createNewUser(
    userTypes.USER_STUDENT,
    studentData,
  );

  create_users.push(admin, departmentHead, lecturer, student);

  expect(admin).toBeDefined();
  expect(admin.registration_id).toBe(adminData.registration_id);
  expect(admin.address).toStrictEqual(adminData.address);
  expect(admin.name).toStrictEqual(adminData.name);
  expect(admin.email).toBe(adminData.email);
  expect(admin).toBeInstanceOf(Admin);
  expect(admin._type).toBe(userTypes.USER_ADMIN);

  expect(departmentHead).toBeDefined();
  expect(departmentHead.registration_id).toBe(
    departmentHeadData.registration_id,
  );
  expect(departmentHead.address).toStrictEqual(departmentHeadData.address);
  expect(departmentHead.name).toStrictEqual(departmentHeadData.name);
  expect(departmentHead.email).toBe(departmentHeadData.email);
  expect(departmentHead).toBeInstanceOf(DepartmentHead);
  expect(departmentHead._type).toBe(userTypes.USER_DEPARTMENT);

  expect(lecturer).toBeDefined();
  expect(lecturer.registration_id).toBe(lecturerData.registration_id);
  expect(lecturer.address).toStrictEqual(lecturerData.address);
  expect(lecturer.name).toStrictEqual(lecturerData.name);
  expect(lecturer.email).toBe(lecturerData.email);
  expect(lecturer).toBeInstanceOf(Lecturer);
  expect(lecturer._type).toBe(userTypes.USER_LECTURER);

  expect(student).toBeDefined();
  expect(student.registration_id).toBe(studentData.registration_id);
  expect(student.address).toStrictEqual(studentData.address);
  expect(student.name).toStrictEqual(studentData.name);
  expect(student.email).toBe(studentData.email);
  expect(student).toBeInstanceOf(Student);
  expect(student._type).toBe(userTypes.USER_STUDENT);

  const new_adminEmail = faker.internet.email().toLowerCase();
  const new_departmentHeadEmail = faker.internet.email().toLowerCase();
  const new_lecturerEmail = faker.internet.email().toLowerCase();
  const new_studentEmail = faker.internet.email().toLowerCase();

  admin.email = new_adminEmail;
  departmentHead.email = new_departmentHeadEmail;
  lecturer.email = new_lecturerEmail;
  student.email = new_studentEmail;

  const updatedAdmin = await service.setSuspend(
    userTypes.USER_ADMIN,
    admin.id,
    true,
  );
  const updatedDepartmentHead = await service.setSuspend(
    userTypes.USER_DEPARTMENT,
    departmentHead.id,
    true,
  );
  const updatedLecturer = await service.setSuspend(
    userTypes.USER_LECTURER,
    lecturer.id,
    true,
  );
  const updatedStudent = await service.setSuspend(
    userTypes.USER_STUDENT,
    student.id,
    true,
  );

  expect(updatedAdmin).toBeDefined();
  expect(updatedDepartmentHead).toBeDefined();
  expect(updatedLecturer).toBeDefined();
  expect(updatedStudent).toBeDefined();

  expect(updatedAdmin.registration_id).toBe(adminData.registration_id);
  expect(updatedDepartmentHead.registration_id).toBe(
    departmentHeadData.registration_id,
  );
  expect(updatedLecturer.registration_id).toBe(lecturerData.registration_id);
  expect(updatedStudent.registration_id).toBe(studentData.registration_id);

  expect(updatedAdmin.address).toStrictEqual(adminData.address);
  expect(updatedDepartmentHead.address).toStrictEqual(
    departmentHeadData.address,
  );
  expect(updatedLecturer.address).toStrictEqual(lecturerData.address);
  expect(updatedStudent.address).toStrictEqual(studentData.address);

  expect(updatedAdmin.name).toStrictEqual(adminData.name);
  expect(updatedDepartmentHead.name).toStrictEqual(departmentHeadData.name);
  expect(updatedLecturer.name).toStrictEqual(lecturerData.name);
  expect(updatedStudent.name).toStrictEqual(studentData.name);

  expect(updatedAdmin.email).toBe(adminData.email);
  expect(updatedDepartmentHead.email).toBe(departmentHeadData.email);
  expect(updatedLecturer.email).toBe(lecturerData.email);
  expect(updatedStudent.email).toBe(studentData.email);

  expect(updatedAdmin).toBeInstanceOf(Admin);
  expect(updatedDepartmentHead).toBeInstanceOf(DepartmentHead);
  expect(updatedLecturer).toBeInstanceOf(Lecturer);
  expect(updatedStudent).toBeInstanceOf(Student);

  expect(updatedAdmin._type).toBe(userTypes.USER_ADMIN);
  expect(updatedDepartmentHead._type).toBe(userTypes.USER_DEPARTMENT);
  expect(updatedLecturer._type).toBe(userTypes.USER_LECTURER);
  expect(updatedStudent._type).toBe(userTypes.USER_STUDENT);

  expect(updatedAdmin.enable_state).toBe(false);
  expect(updatedDepartmentHead.enable_state).toBe(false);
  expect(updatedLecturer.enable_state).toBe(false);
  expect(updatedStudent.enable_state).toBe(false);
});

test('should we able to check user is suspended or not', async () => {
  const isSuspended = new UserService().isSuspended;

  create_users.forEach((user) => {
    expect(user.enable_state).toBe(!isSuspended(user));
  });
});

test('should check user instance is valid format instance', async () => {
  const data = {};
  data.registration_id = faker.string.uuid();
  data.address = {
    line1: faker.location.streetAddress({ useFullAddress: true }),
    line2: faker.location.streetAddress({ useFullAddress: true }),
    zip: faker.location.zipCode(),
  };

  data.email = faker.internet.email().toLowerCase();
  data.name = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    full_name: faker.person.fullName(),
    with_initial_name: faker.person.fullName(),
  };
  data.password = await PasswordHashService.hashPassword(
    faker.internet.password(10),
  );

  const service = new UserService();
  const user = await service.createNewUser(userTypes.USER_STUDENT, data);

  expect(user).toBeDefined();
  expect(user.registration_id).toBe(data.registration_id);
  expect(user.address).toStrictEqual(data.address);
  expect(user.name).toStrictEqual(data.name);
  expect(user.email).toBe(data.email);
  expect(user).toBeInstanceOf(Student);
  expect(user._type).toBe(userTypes.USER_STUDENT);
});

test('should delete student by id suing userService', async () => {
  const dataGen = async () => {
    const data = {};
    data.registration_id = faker.string.uuid();
    data.address = {
      line1: faker.location.streetAddress({ useFullAddress: true }),
      line2: faker.location.streetAddress({ useFullAddress: true }),
      zip: faker.location.zipCode(),
    };

    data.email = faker.internet.email().toLowerCase();
    data.name = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      full_name: faker.person.fullName(),
      with_initial_name: faker.person.fullName(),
    };
    data.password = await PasswordHashService.hashPassword(
      faker.internet.password(10),
    );
    return data;
  };

  const service = new UserService();

  const adminData = await dataGen();
  const departmentHeadData = await dataGen();
  const lecturerData = await dataGen();
  const studentData = await dataGen();

  const admin = await service.createNewUser(userTypes.USER_ADMIN, adminData);
  const departmentHead = await service.createNewUser(
    userTypes.USER_DEPARTMENT,
    departmentHeadData,
  );
  const lecturer = await service.createNewUser(
    userTypes.USER_LECTURER,
    lecturerData,
  );
  const student = await service.createNewUser(
    userTypes.USER_STUDENT,
    studentData,
  );

  expect(service.isInstanceOfAdmin(admin)).toBe(true);
  expect(service.isInstanceOfDepartmentHead(departmentHead)).toBe(true);
  expect(service.isInstanceOfLecturer(lecturer)).toBe(true);
  expect(service.isInstanceOfStudent(student)).toBe(true);

  expect(service.isInstanceOfAdmin(departmentHead)).toBe(false);
  expect(service.isInstanceOfDepartmentHead(admin)).toBe(false);
  expect(service.isInstanceOfLecturer(student)).toBe(false);
  expect(service.isInstanceOfStudent(lecturer)).toBe(false);
});
