const { UserRepository } = require('../DATABASE');
const NullUser = require('./NullUser');
const repository = new UserRepository();

/**
 * Represents a User in the system.
 * Provides methods to create, read, update, and delete users.
 */
class User {
  /** @type {string} */
  registration_id;
  /** @type {string} */
  name;
  /** @type {string} */
  email;
  /** @type {string} */
  address;
  /** @type {string} */
  id;
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
  /** @type {boolean} */
  deleted
  /** @type {Date} */
  createdAt_timestamp;
  /** @type {Date} */
  updatedAt_timestamp;
  /** @type {string} */
  _type;

  /** @type {string} */
  _department;

  /**
   * Creates a new User instance.
   * @param {Object} data - Initial data to populate the User.
   */
  constructor(data = {}) {
    this.id = data._id || data.id;
    this.registration_id = data.registration_id;
    this.name = data.name;
    this.email = data.email;
    this.address = data.address;
    this.password = data.password;
    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    this.last_login = data.last_login;
    this.enable_state = data.enable_state;
    this.deleted = data.deleted;
    this._department = data.department;
    this._type = data.type;

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
      'registration_id',
      'name',
      'email',
      'address',
      'password',
      'access_token',
      'refresh_token',
      'last_login',
      'enable_state',
      'deleted',
      '_type',
      'createdAt_timestamp',
      'updatedAt_timestamp',
      '_department',
    ];

    const params = {};
    for (const field of fields) {
      if (this[field] !== undefined) {
        params[
          field === '_type'
            ? 'type'
            : field === '_department'
              ? 'department'
              : field
        ] = this[field];
      }
    }
    return params;
  }

  #wrapTONullUser() {
    return NullUser;
  }

  #wrapToUser(obj) {
    if (!obj) return this.#wrapTONullUser();
    return new User(obj);
  }

  /**
   * Saves the user to the database (create or update).
   * @returns {Promise<User>} The saved User instance.
   * @throws Will throw an error if saving fails.
   */
  async save() {
    try {
      const params = this.#matchFieldsAndParams();
      const returned_object = await repository.save(params);
      return this.#wrapToUser(returned_object);
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(user) {
    try {
      const returned_object = await repository.save(user);
      return this.#wrapToUser(returned_object);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Finds a user by ID.
   * @param {string} user_id - The ID of the user to find.
   * @returns {Promise<User>} The found User instance.
   * @throws Will throw an error if the user is not found or DB error occurs.
   */
  async findById(user_id) {
    try {
      const user = await repository.findById(user_id);
      return this.#wrapToUser(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Finds users matching the current User instance fields.
   * @returns {Promise<User[]>} Array of User instances that match.
   * @throws Will throw an error if the query fails.
   */
  async find(options = {}) {
    try {
      const params = this.#matchFieldsAndParams();
      const users = await repository.find(params, options);

      return users.map((user) => this.#wrapToUser(user));
    } catch (error) {
      throw error;
    }
  }

  async findOne(options = {}) {
    try {
      const params = this.#matchFieldsAndParams();
      const user = await repository.findOne(params, options);
      return this.#wrapToUser(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a user matching the current User instance fields.
   * @returns {Promise<User>} The deleted User instance.
   * @throws Will throw an error if the deletion fails.
   */
  async deleteOne() {
    try {
      const params = this.#matchFieldsAndParams();
      const user = await repository.deleteOne(params);
      return this.#wrapToUser(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a user by ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<User>} The deleted User instance.
   * @throws Will throw an error if deletion fails.
   */
  async deleteById(id) {
    try {
      const deleted = await repository.deleteById(id);
      return this.#wrapToUser(deleted);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
