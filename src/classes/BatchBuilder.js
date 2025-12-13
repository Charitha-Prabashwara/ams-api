const { BatchRepository } = require('./DATABASE');
const Batch = require('./Batch');
const  repository = new BatchRepository();

/**
 * BatchBuilder
 *
 * Builder class used to construct parameters for creating a Batch record
 * and to perform the creation via the BatchRepository. The builder accepts
 * a plain object (typically from an API request or DB document) and exposes
 * a fluent-ish interface to prepare creation parameters.
 *
 * Properties (inputs):
 * - id: string | undefined         MongoDB _id (when present)
 * - name: string | undefined       Human-readable batch name
 * - lb: number | undefined         Lower bound (domain-specific meaning)
 * - up: number | undefined         Upper bound (domain-specific meaning)
 *
 * Usage example:
 *   const builder = new BatchBuilder({ name: '2023', lb: 2020, up: 2024 })
 *   const batch = await builder.create()
 *
 * Errors thrown by the repository are propagated to the caller.
 *
 * @class
 */
class BatchBuilder {
  name;
  academic;

  /**
   * Create a new BatchBuilder
   * @param {Object} [data={}] - source data to initialize the builder
   * @param {string} [data._id] - optional MongoDB id
   * @param {string} [data.name]
   * @param {JSON}   [data.academic]
   * @param {number} [data.lb]
   * @param {number} [data.ub]
   */
  constructor(data = {}) {
    this.name = data.name;
    this.academic = data.academic;
   
  }
  /**
   * Prepares a parameter object for database operations,
   * including only defined fields.
   * @private
   * @returns {Promise<Object>} Parameters object for queries.
   */
  #matchFieldsAndParams() {
    const fields = ['name', 'academic'];
    const params = {};
    for (const field of fields) {
      if (this[field] !== undefined) {
        params[field] = this[field];
      }
    }
    return params;
  }

  /**
   * Create a Batch record in the repository using the fields set on the builder.
   * Only defined fields are forwarded to the repository.
   *
   * @returns {Promise<Batch>} Promise that resolves to a new Batch instance
   * @throws {Error} Propagates any repository error
   */
  async create() {
    try {
      const params = this.#matchFieldsAndParams();
      const batch = await repository.create(params);
      return new Batch(batch);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = BatchBuilder;
