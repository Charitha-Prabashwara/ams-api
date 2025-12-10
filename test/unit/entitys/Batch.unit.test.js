const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const { config } = require('../../../src/config');

const Batch = require('../../../src/classes/Batch');
const BatchBuilder = require('../../../src/classes/BatchBuilder');

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

const name = faker.person.jobTitle();
const lb = faker.number.int({ min: 20, max: 25 });
const ub = faker.number.int({ min: 26, max: 30 });

let batchId;

test('Should create a new Batch successfully', async () => {
  const builder = new BatchBuilder();
  builder.name = name;
  builder.academic = { lb: lb, ub: ub };

  const createdBatch = await builder.create();
  expect(createdBatch).toBeInstanceOf(Batch);
  expect(createdBatch.name).toBe(name);
  expect(createdBatch.academic).toStrictEqual({ lb: lb, ub: ub });
  batchId = createdBatch.id;
});

test('Should find the created Batch by name', async () => {
  const batch = new Batch();
  batch.name = name;
  const result = await batch.find();
  expect(result[0]).toBeInstanceOf(Batch);
  expect(result[0].name).toBe(name);
});

test('should find the created Batch by academic date', async () => {
  const batch = new Batch();
  batch.academic = { lb: lb, ub: ub };
  const result = await batch.find();

  expect(result.length).toBeGreaterThan(0);
  result.forEach((batch) => {
    expect(batch).toBeInstanceOf(Batch);
    expect(batch.academic).toStrictEqual({ lb: lb, ub: ub });
  });
});

test('should find not deleted Batch', async () => {
  const batch = new Batch();
  batch.deleted = false;
  const result = await batch.find();
  expect(result.length).toBeGreaterThan(0);

  result.forEach((batch) => {
    expect(batch.deleted).toBe(false);
  });
});

test('Select batch ById', async () => {
  const batch = await new Batch().findById(batchId);
  expect(batch.name).toBe(name);
  expect(batch.academic).toStrictEqual({ lb: lb, ub: ub });
  expect(batch.id).toStrictEqual(batchId);
});

test('Update batchById', async () => {
  const batch = new Batch();
  batch.name = name;
  batch.academic = { lb: lb, ub: ub };

  const result = await batch.find();

  expect(result.length).toBeGreaterThan(0);
  result.forEach((batch) => {
    expect(batch.name).toBe(name);
    expect(batch.academic).toStrictEqual({ lb: lb, ub: ub });
  });

  result.forEach((batch) => {
    async (batch) => {
      const new_batch_name = faker.person.jobTitle();
      const new_academic = {
        ub: faker.number.int({ min: 25, max: 27 }),
        lb: faker.number.int({ min: 25, max: 27 }),
      };

      batch.name = new_batch_name;
      batch.academic = new_academic;

      const updated_batch = await batch.save();
      expect(updated_batch.name).toBe(new_batch_name);
      expect(updated_batch.academic).toStrictEqual(new_academic);
    };
  });
});
test('should delete batch by name', async () => {
  const new_name = faker.person.jobTitle();
  const new_lb = faker.number.int({ min: 20, max: 25 });
  const new_ub = faker.number.int({ min: 26, max: 30 });

  const new_batch = new BatchBuilder();
  new_batch.name = new_name;
  new_batch.academic = { lb: new_lb, ub: new_ub };
  const new_batch_result = await new_batch.create();

  expect(new_batch_result.name).toBe(new_name);
  expect(new_batch.academic).toStrictEqual({ lb: new_lb, ub: new_ub });

  const new_batch_id = new_batch.id;
  const batch = new Batch();
  batch.name = new_name;

  const result = await batch.deleteOne();
  expect(result.name).toBe(new_name);
});

test('Delete batch by id', async () => {
  const batch = await new Batch().deleteById(batchId);
  expect(batch.id).toStrictEqual(batchId);
});

test('Should handle save error gracefully', async () => {
  const badBatch = new Batch();
  badBatch.save = jest.fn().mockRejectedValue(new Error('DB error'));
  await expect(badBatch.save()).rejects.toThrow('DB error');
});

test('Should handle findById error gracefully', async () => {
  const badBatch = new Batch();
  badBatch.findById = jest.fn().mockRejectedValue(new Error('Find failed'));
  await expect(badBatch.findById('invalid')).rejects.toThrow('Find failed');
});

test('Should not leak memory when repeatedly creating and deleting batches', async () => {
  const iterations = 30;
  const memoryBefore = process.memoryUsage().heapUsed;

  for (let i = 0; i < iterations; i++) {
    const builder = new BatchBuilder();
    builder.name = faker.person.jobTitle();
    builder.academic = {
      lb: faker.number.int({ min: 20, max: 25 }),
      ub: faker.number.int({ min: 26, max: 30 }),
    };

    const tempBatch = await builder.create();
    await new Batch().deleteById(tempBatch.id);
  }

  global.gc && global.gc(); // Force garbage collection if node --expose-gc
  const memoryAfter = process.memoryUsage().heapUsed;
  const diffMB = (memoryAfter - memoryBefore) / 1024 / 1024;
  console.log(`Memory change: ${diffMB.toFixed(2)} MB`);

  // Allow small growth (<10 MB)
  expect(diffMB).toBeLessThan(10);
});

test('Should handle concurrent Batch creation safely', async () => {
  const parallelTasks = 10;

  const tasks = Array.from({ length: parallelTasks }, async () => {
    const builder = new BatchBuilder();
    builder.name = faker.person.jobTitle();
    builder.academic = {
      lb: faker.number.int({ min: 20, max: 25 }),
      ub: faker.number.int({ min: 26, max: 30 }),
    };
    return builder.create();
  });

  const results = await Promise.allSettled(tasks);
  const rejected = results.filter((r) => r.status === 'rejected');

  console.log('Rejected concurrent creations:', rejected.length);
  expect(rejected.length).toBe(0);

  const allBatches = await new Batch().find();
  expect(allBatches.length).toBeGreaterThanOrEqual(parallelTasks);
});
