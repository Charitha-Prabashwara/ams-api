const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DepartmentService = require('../../../src/services/DepartmentService');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');
const Department = require('../../../src/classes/Department');

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

describe('DepartmentService – Integration Test', () => {
  let service;

  beforeEach(() => {
    service = new DepartmentService();
  });

  test('should create a department', async () => {
    const name = {
      long: 'Department of Information and Communication Technology',
      short: 'Department of ICT',
      key: 'DICT',
    };
    const description = 'Technology & Computer Science';

    const result = await service.createDepartment(name, description);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toStrictEqual(name);
  });

  test('should get department by ID', async () => {
    const builder = new DepartmentBuilder();
    const name = {
      long: 'Department of Information and Communication Technology',
      short: 'Department of ICT',
      key: 'DICT',
    };
    builder.name = name;
    builder.description = 'Math Faculty';

    const created = await builder.create();

    const found = await service.getDepartmentById(created.id);

    expect(found).toBeDefined();
    expect(found.id).toStrictEqual(created.id);
    expect(found.name).toStrictEqual(name);
  });

  test('should return list of departments', async () => {
    const departmentInstance = new Department();
    const list = await service.getFindDepartment(departmentInstance);

    expect(list).toBeInstanceOf(Array);
  });

  test('should delete department by ID', async () => {
    const builder = new DepartmentBuilder();
    builder.name = {
      long: 'Department of Information and Communication Technology',
      short: 'Department of ICT',
      key: 'DICT',
    };
    builder.description = 'Math Faculty';

    const created = await builder.create();

    const deleted = await service.deleteDepartmentById(created.id);

    expect(deleted).toBeDefined();
    expect(deleted.id).toStrictEqual(created.id);
  });

  test('should null object when department not found', async () => {
    const dept = await service.getDepartmentById('123456789012345678901234');
    await expect(service.isNullDepartment(dept)).toBe(true);
  });

  test('should update department byId', async () => {
    const builder = new DepartmentBuilder();
    const name = {
      long: 'Department of Information and Communication Technology',
      short: 'Department of ICT',
      key: 'DICT2',
    };
    builder.name = name;
    builder.description = 'Math Faculty';

    const created = await builder.create();

    const found = await service.getDepartmentById(created.id);

    expect(found).toBeDefined();
    expect(found.id).toStrictEqual(created.id);
    expect(found.name).toStrictEqual(name);

    const updateDept = {
      id: created.id,
      name: {
        long: 'Department of Information and Communication Technology updated',
        short: 'Department of ICT updated',
        key: 'DICT3',
      },
    };
    const updatedDept = await service.updateDepartmentById(updateDept);
    expect(updatedDept).toBeDefined();
    expect(updatedDept.id).toStrictEqual(created.id);
    expect(updatedDept.name).toStrictEqual(updateDept.name);
  });

  test('should department can find using name, description, deleted, createdAT, updatedAT', async () => {
    const builder = new DepartmentBuilder();
    const name = {
      long: 'test long',
      short: 'lest short',
      key: 'key',
    };
    builder.name = name;
    builder.description = 'Math Faculty';

    const created = await builder.create();

    const found = await service.getDepartmentById(created.id);

    expect(found).toBeDefined();
    expect(found.id).toStrictEqual(created.id);
    expect(found.name).toStrictEqual(name);

    let dept = await service.getFindDepartment({ name: { long: name.long } });
    expect(service.isNullDepartment(dept)).toBe(false);
    dept = await service.getFindDepartment({ name: { short: name.short } });
    expect(service.isNullDepartment(dept)).toBe(false);
    dept = await service.getFindDepartment({ name: { key: name.key } });
    expect(service.isNullDepartment(dept)).toBe(false);
    dept = await service.getFindDepartment({ description: 'Math Faculty' });
    expect(service.isNullDepartment(dept)).toBe(false);

    dept = await service.getFindDepartment({
      createdAt_timestamp: found.createdAt_timestamp,
    });
    expect(service.isNullDepartment(dept)).toBe(false);
    dept = await service.getFindDepartment({
      updatedAt_timestamp: found.updatedAt_timestamp,
    });
    expect(service.isNullDepartment(dept)).toBe(false);
  });
});
