const { model } = require('mongoose');
const { BatchRepository } = require('./DATABASE');
class Batch {
  id;
  name;
  lb;
  up;
  createdAt_timestamp;
  updatedAt_timestamp;
  deleted;

  constructor(data = {}) {
    this.id = data._id || data.id;
    this.name = data.name;
    this.academic = data.academic;
    this.deleted = data.deleted;
    this.createdAt_timestamp = data.createdAt_timestamp;
    this.updatedAt_timestamp = data.updatedAt_timestamp;

    this.repository = new BatchRepository();
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

  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await this.repository.save(params);
      return new Batch(batch);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const batch = await this.repository.findById(id);
      return new Batch(batch);
    } catch (error) {
      throw error;
    }
  }

  async find() {
    try {
      const params = this.#matchFieldsAndParams();
      const batches = await this.repository.find(params);
      return batches.map((batch) => new Batch(batch));
    } catch (error) {
      throw error;
    }
  }

  async deleteOne() {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await this.repository.deleteOne(params);
      return new Batch(batch);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const batch = await this.repository.deleteById(id);
      return new Batch(batch);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Batch;
