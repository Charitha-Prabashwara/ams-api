const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const BatchService = require('../../../src/services/BatchService');
const Batch = require('../../../src/classes/Batch');
const { faker } = require('@faker-js/faker');
const NullBatch = require('../../../src/classes/NullBatch');

let mongoServer;
let service = new BatchService();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Batch service test', () => {
  let createdBatch;

  test('should create new batch', async () => {
    const name = faker.word.words(2);
    const academic = {
      lb: faker.number.int({ min: 2018, max: 2022 }),
      ub: faker.number.int({ min: 2023, max: 2027 }),
    };

    const batch = await service.createBatch(academic, name);

    expect(batch).toBeDefined();
    expect(batch).not.toBe(NullBatch);
    expect(batch).toBeInstanceOf(Batch);

    expect(batch.name).toBe(name);
    expect(batch.academic).toBeDefined();
    expect(batch.academic.lb).toBe(academic.lb);
    expect(batch.academic.ub).toBe(academic.ub);

    createdBatch = batch;
  });

  test('should get batch by batch id', async () => {
    const batch = await service.getBatchById(createdBatch.id);

    expect(batch).toBeDefined();
    expect(batch).not.toBe(NullBatch);
    expect(batch).toBeInstanceOf(Batch);
    expect(batch.id).toStrictEqual(createdBatch.id);
  });

  test('should find batch by name', async () => {
    const data = { name: createdBatch.name };
    const options = {};

    const batches = await service.getFindBatch(data, options);

    batches.forEach(batch => {
      expect(batch).toBeDefined();
      expect(batch).not.toBe(NullBatch);
      expect(batch).toBeInstanceOf(Batch);
      expect(batch.name).toBe(createdBatch.name);
    });

    expect(batches.length).toBeGreaterThanOrEqual(1);
  });

  test('should find batch by academic range', async () => {
    const data = { academic: createdBatch.academic };
    const options = {};

    const batches = await service.getFindBatch(data, options);

    batches.forEach(batch => {
      expect(batch).toBeDefined();
      expect(batch).not.toBe(NullBatch);
      expect(batch).toBeInstanceOf(Batch);
      expect(batch.academic).toBeDefined();
    });
  });

  test('should update batch by batch id', async () => {
    const updatedName = faker.word.words(3);

    const data = {
      id: createdBatch.id,
      name: updatedName,
      academic: createdBatch.academic,
      deleted: false,
    };

    const batch = await service.updateBatchById(data);

    expect(batch).toBeDefined();
    expect(batch).not.toBe(NullBatch);
    expect(batch).toBeInstanceOf(Batch);
    expect(batch.name).toBe(updatedName);
    expect(batch.deleted).toBe(false);
  });

  test('should delete batch by batch id', async () => {
    const batch = await service.deleteBatchById(createdBatch.id);

    expect(batch).toBeDefined();
    expect(batch).not.toBe(NullBatch);
    expect(batch).toBeInstanceOf(Batch);
  });

  test('should return null object when cant find by id', async () => {
    const batch = await service.getBatchById(
      '693c6de4846f017f580afc37'
    );

    expect(batch).toBeDefined();
    expect(batch).toBe(NullBatch);
  });

  test('should return null object when cant update by id', async () => {
    const batch = await service.updateBatchById({
      id: '693c6de4846f017f580afc37',
    });

    expect(batch).toBeDefined();
    expect(batch).toBe(NullBatch);
  });

  test('should return null object when cant delete by id', async () => {
    const batch = await service.deleteBatchById(
      '693c6de4846f017f580afc37'
    );

    expect(batch).toBeDefined();
    expect(batch).toBe(NullBatch);
  });

  test('should validate null objects using service', async () => {
    const batch = await service.deleteBatchById(
      '693c6de4846f017f580afc37'
    );

    expect(batch).toBeDefined();
    expect(batch).toBe(NullBatch);

    const isNullObject = service.isNullBatch(batch);
    expect(isNullObject).toBe(true);
  });
});
