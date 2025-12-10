const Department = require('../classes/Department');
const NullDepartment = require('../classes/NullDepartment');
const DepartmentBuilder = require('../classes/DepartmentBuilder');
const { DepartmentNotFoundError } = require('../errors');

/**
 * @class DepartmentService
 * @classdesc
 * Service layer responsible for handling all Department-related operations.
 * This class abstracts database access from controllers and promotes
 * maintainable, testable, and business-logic-focused design.
 *
 * Provides high-level operations such as creating departments,
 * retrieving department details, filtering data, and deleting departments.
 */
class DepartmentService {
  /**
   * Initializes a new instance of DepartmentService.
   * Creates a reusable Department model instance for repeated DB operations.
   */
  constructor() {
    /** @private */
    this.deptClass = new Department();
  }

  /**
   * Retrieve a department record by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the department.
   * @returns {Promise<Object|null>}
   * Resolves with the department object if found, otherwise `null`.
   *
   * @throws {Error} Propagates any underlying database or model errors.
   */
  async getDepartmentById(id) {
    return this.deptClass.findById(id);
  }

  /**
   * Retrieve departments based on dynamic filtering criteria.
   * Accepts partial filter fields and delegates matching logic to the model.
   *
   * @async
   * @param {Object} [data={}] - Filtering criteria.
   * @param {string} [data.name] - Department name (full or partial).
   * @param {string} [data.description] - Description text (full or partial).
   * @param {boolean} [data.deleted] - Filter by deletion state.
   * @param {number} [data.createdAt_timestamp] - Creation timestamp filter.
   * @param {number} [data.updatedAt_timestamp] - Last update timestamp filter.
   *
   * @returns {Promise<Array<Object>>}
   * A list of matching departments. Empty array if none match.
   *
   * @throws {Error} If the model encounters invalid filter data.
   */
  async getFindDepartment(data = {}, options = {}) {
    const dept = new Department();

    if (data.name) {
      if (data.name.long) dept['name.long'] = data.name.long;
      if (data.name.short) dept['name.short'] = data.name.short;
      if (data.name.key) dept['name.key'] = data.name.key;
    }

    if (data.description) dept.description = data.description;
    if (data.deleted != undefined) dept.deleted = data.deleted;
    if (data.createdAt_timestamp)
      dept.createdAt_timestamp = data.createdAt_timestamp;
    if (data.updatedAt_timestamp)
      dept.updatedAt_timestamp = data.updatedAt_timestamp;

    return dept.find(options);
  }

  /**
   * Create a new department using a builder pattern.
   *
   * @async
   * @param {Object} name - Department name components.
   * @param {string} name.long - Full descriptive name.
   * @param {string} name.short - Abbreviated department name.
   * @param {string} name.key - Unique department key identifier.
   * @param {string} description - Department description.
   *
   * @returns {Promise<Object>}
   * The newly created department object.
   *
   * @throws {Error}
   * If validation fails or the builder encounters construction issues.
   */
  async createDepartment(name = {}, description) {
    const { long, short, key } = name;
    const builder = new DepartmentBuilder();

    builder.name = { long: long, short: short, key: key };
    builder.description = description;

    return builder.create();
  }

  /**
   * Delete a department by its unique identifier.
   * Performs a soft delete or hard delete depending on model implementation.
   *
   * @async
   * @param {string} id - The department ID to delete.
   * @returns {Promise<boolean>}
   * Resolves `true` if deletion succeeded, otherwise `false`.
   *
   * @throws {Error}
   * If the deletion process encounters database/model errors.
   */
  async deleteDepartmentById(id) {
    return this.deptClass.deleteById(id);
  }

  async updateDepartmentById(data = {}) {
    return this.deptClass.findByIdAndUpdate(data);
  }

  isNullDepartment(dept) {
    return dept == NullDepartment;
  }
}

module.exports = DepartmentService;
