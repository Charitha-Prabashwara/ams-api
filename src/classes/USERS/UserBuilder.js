const { UserRepository } = require('../DATABASE');
const User = require('./User');
const repository = new UserRepository();

/**
 * UserBuilder is responsible for creating User instances.
 * It allows flexible initialization of user data and handles
 * the creation process through the repository.
 */
class UserBuilder {
  /** @type {string} */
  registration_id;
  /** @type {string} */
  name;
  /** @type {string} */
  email;
  /** @type {string} */
  address;
  /** @type {string} */

  password;
  /** @type {string} */
  access_token;
  /** @type {string} */
  refresh_token;
  /** @type {Date} */
  last_login;
  /** @type {boolean} */
  enable_state;
  /** @type {string} */
  _type;
  /** @type {string} */
  _department;

  /**
   * Creates a new UserBuilder instance.
   * @param {Object} data - Optional data to initialize the builder.
   */
  constructor(data = {}) {
    this.registration_id = data.registration_id;
    this.name = data.name;
    this.email = data.email;
    this.address = data.address;
    this.password = data.password;
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    this.last_login = data.last_login;
    this.enable_state = data.enable_state;
    this._type = data.type;
    this._department = data.department;
  }

  /**
   * Prepares a parameter object for database operations,
   * including only defined fields.
   * @private
   * @returns {Promise<Object>} Parameters object for queries.
   */
  #matchFieldsAndParams() {
    const fields = [
      'registration_id',
      'name',
      'email',
      'address',
      'password',
      'access_token',
      'refresh_token',
      'last_login',
      'enable_state',
      '_type',
      '_department',
    ];

    const params = {};
    for (const field of fields) {
      params[
        field === '_type'
          ? 'type'
          : field === '_department'
            ? 'department'
            : field
      ] = this[field];
    }
    return params;
  }

  /**
   * Prepares a parameter object for database operations,
   * including only fields that are defined on the builder.
   * @private
   * @returns {Promise<Object>} Parameters object ready for DB operations.
   */
  async create() {
    try {
      const params = this.#matchFieldsAndParams();
      const user = await repository.create(params);
      return new User(user);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserBuilder;
