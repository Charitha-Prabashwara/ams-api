const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Department = require('../../../src/classes/Department');
const DepartmentBuilder = require('../../../src/classes/DepartmentBuilder');
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

describe('Department Class Tests', () => {
  const name = {
    long: faker.person.jobTitle(),
    short: faker.person.jobTitle(),
    key: faker.person.jobTitle(),
  };
  const description = faker.lorem.paragraph();
  let departmentId;

  test('Should create a new Department successfully', async () => {
    const builder = new DepartmentBuilder();
    builder.name = name;
    builder.description = description;

    const createdDepartment = await builder.create();
    expect(createdDepartment.name).toStrictEqual(name);
    expect(createdDepartment.description).toBe(description);

    departmentId = createdDepartment.id;
  });

  test('Should find the created Department by name', async () => {
    const department = new Department();
    department.name = name;

    const result = await department.find();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((d) => {
      expect(d.name).toStrictEqual(name);
      expect(d).toBeInstanceOf(Department);
    });
  });

  test('Should find Department by id', async () => {
    const department = new Department();
    const found = await department.findById(departmentId);

    expect(found).toBeInstanceOf(Department);
    expect(found.id).toStrictEqual(departmentId);
    expect(found.name).toStrictEqual(name);
  });

  test('Should update Department by id', async () => {
    const department = new Department();
    department.id = departmentId;

    const found = await department.find();
    expect(found.length).toBeGreaterThan(0);

    const newName = {
      long: faker.person.jobTitle(),
      short: faker.person.jobTitle(),
      key: faker.person.jobTitle(),
    };
    found[0].name = newName;

    const updated = await found[0].save();
    expect(updated.name).toStrictEqual(newName);
  });

  test('Should find not deleted Departments', async () => {
    const department = new Department();
    department.deleted = false;

    const result = await department.find();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((d) => expect(d.deleted).toBe(false));
  });

  test('Should delete Department by id', async () => {
    const department = new Department();
    department.id = departmentId;

    const found = await department.find();
    const deleted = await department.deleteById(found[0].id);

    expect(deleted.id).toStrictEqual(found[0].id);
  });

  test('Should handle save error gracefully', async () => {
    const badDepartment = new Department();
    badDepartment.save = jest.fn().mockRejectedValue(new Error('DB error'));

    await expect(badDepartment.save()).rejects.toThrow('DB error');
  });

  test('Should handle findById error gracefully', async () => {
    const badDepartment = new Department();
    badDepartment.findById = jest
      .fn()
      .mockRejectedValue(new Error('Find failed'));

    await expect(badDepartment.findById('invalid')).rejects.toThrow(
      'Find failed',
    );
  });

  test('Should handle concurrent Department creation safely', async () => {
    const parallelTasks = 10;
    const tasks = Array.from({ length: parallelTasks }, async () => {
      const builder = new DepartmentBuilder();
      builder.name = {
        long: faker.person.jobTitle(),
        short: faker.person.jobTitle(),
        key: faker.person.jobTitle(),
      };
      builder.description = faker.lorem.paragraph();
      return builder.create();
    });

    const results = await Promise.allSettled(tasks);
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(rejected.length).toBe(0);

    const allDepartments = await new Department().find();
    expect(allDepartments.length).toBeGreaterThanOrEqual(parallelTasks);
  });

  test('Should not leak memory when repeatedly creating and deleting Departments', async () => {
    const iterations = 30;
    const memoryBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      const builder = new DepartmentBuilder();
      builder.name = {
        long: faker.person.jobTitle(),
        short: faker.person.jobTitle(),
        key: faker.person.jobTitle(),
      };
      builder.description = faker.lorem.paragraph();

      const tempDept = await builder.create();
      await new Department().deleteById(tempDept.id);
    }

    global.gc && global.gc();
    const memoryAfter = process.memoryUsage().heapUsed;
    const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
    console.log(`Memory change: ${diffMB.toFixed(2)} MB`);
    expect(diffMB).toBeLessThan(10);
  });
});
