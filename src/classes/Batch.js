const { BatchRepository } = require('./DATABASE');
const NullBatch = require('./NullBatch')
const repository = new BatchRepository();
class Batch {
  id;
  name;
  academic;
  createdAt_timestamp;
  updatedAt_timestamp;
  deleted;

  constructor(data = {}) {
    this.id = data._id ?? data.id;
    this.name = data.name;
    this.academic = data.academic;
    this.deleted = data.deleted;
    this.createdAt_timestamp = data.createdAt_timestamp;
    this.updatedAt_timestamp = data.updatedAt_timestamp;
  
  }

  /**
   * Prepares a parameter object for database operations,
   * including only defined fields.
   * @private
   * @returns {Promise<Object>} Parameters object for queries.
   */
  #matchFieldsAndParams() {
    const fields = [
      'id',
      'name',
      'academic',
      'deleted',
      'createdAt_timestamp',
      'updatedAt_timestamp',
    ];
    const params = {};
    for (const field of fields) {
      if (this[field] !== undefined) {
        params[field === 'id' ? '_id' : field] = this[field];
      }
    }
    return params;
  }

    #wrapTONullBatch() {
      return NullBatch;
    }
  
    #wrapToBatch(obj) {
      if (!obj) return this.#wrapTONullBatch();
      return new Batch(obj);
    }

  async save(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await repository.save(params, select);
      return this.#wrapToBatch(batch);
    } catch (error) {
      throw error;
    }
  }

  async findById(id, select=[]) {
    try {
      const batch = await repository.findById(id, select);
      return this.#wrapToBatch(batch);
    } catch (error) {
      throw error;
    }
  }

   async findByIdAndUpdate(batchObj, select = []) {
    try {
      const batch = await repository.save(batchObj, select);
      return this.#wrapToBatch(batch);
    } catch (error) {
      throw error;
    }
  }

  async find(options={}) {
    try {
      const params = this.#matchFieldsAndParams();
      const batches = await repository.find(params, options);
      return batches.map((batch) => this.#wrapToBatch(batch));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(select=[]) {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await repository.deleteOne(params, select);
      return this.#wrapToBatch(batch);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id, select=[]) {
    try {
      const batch = await repository.deleteById(id, select);
      return this.#wrapToBatch(batch);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Batch;
