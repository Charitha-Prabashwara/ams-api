const {
  Admin,
  DepartmentHead,
  Lecturer,
  Student,
  NullUser,
} = require('../classes/USERS');
const { userTypes } = require('../config');
const {
  selectCorrectUser,
  selectCorrectBuilder,
} = require('./dependencies/userServicesSupport');

/**
 * UserService
 * ------------
 * Service class for managing different types of users (Admin, DepartmentHead, Lecturer, Student).
 * Provides methods for fetching, creating, updating, deleting, and suspending users.
 */
class UserService {
  /**
   * Fetch a user by their database ID.
   * @param {string} userType - The type of user (from userTypes).
   * @param {string} id - The unique ID of the user.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   */
  async getUserById(userType, id) {
    const userClass = selectCorrectUser(userType);
    return await userClass.findById(id);
  }

  /**
   * Fetch a user by their registration ID.
   * @param {string} userType - The type of user (from userTypes).
   * @param {string} registrationId - The registration ID of the user.
   * @param {object} options - We can select, limit, sort, skip
   * @param {string[]} options.select - We can select or hide specific attributes
   * @param {number} [options.limit] - Maximum number of results.
   * @param {number} [options.skip] - Number of documents to skip.
   * @param {object|string} [options.sort] - Sort order.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   */
  async getUserByRegistrationId(userType, registrationId, options = {}) {
    const userClass = selectCorrectUser(userType);
    userClass.registration_id = registrationId;
    return await userClass.findOne(options);
  }

  /**
   * Fetch a user by their email address.
   * @param {string} userType - The type of user (from userTypes).
   * @param {string} email - The email address of the user.
   * @param {object} options - We can select, limit, sort, skip
   * @param {string[]} options.select - We can select or hide specific attributes
   * @param {number} [options.limit] - Maximum number of results.
   * @param {number} [options.skip] - Number of documents to skip.
   * @param {object|string} [options.sort] - Sort order.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   */
  async getUserByEmail(userType, email, options = {}) {
    const userClass = selectCorrectUser(userType);
    userClass.email = email;
    return await userClass.findOne(options);
  }

  /**
   * Retrieve all users and find users based on filter of a given class.
   * @param {Object} user - User class (Admin, Lecturer, DepartmentHead, or Student).
   * @returns {Promise<Array>} Array of user objects.
   */
  async getFindUsers(userType, data = {}, options = {}) {
    const userClass = selectCorrectUser(userType);

    if (data.registration_id != undefined)
      userClass.registration_id = data.registration_id;

    if (data.name.first_name)
      userClass['name.first_name'] = data.name.first_name;
    if (data.name.last_name) userClass['name.last_name'] = data.name.last_name;
    if (data.name.full_name) userClass['name.full_name'] = data.name.full_name;
    if (data.name.with_initial_name)
      userClass['name.with_initial_name'] = data.name.with_initial_name;

    if (data.email) userClass.email = data.email;

    if (data.address.line1) userClass['address.line1'] = data.name.line1;
    if (data.address.line2) userClass['address.line2'] = data.name.line2;
    if (data.address.zip) userClass['address.zip'] = data.name.zip;

    if (data.last_login) userClass.last_login = data.last_login;
    if (data.enable_state) userClass.enable_state = data.enable_state;
    if(data.deleted) userClass.deleted = data.deleted;
    if (data.createdAt_timestamp)
      userClass.createdAt_timestamp = data.createdAt_timestamp;
    if (data.updatedAt_timestamp)
      userClass.updatedAt_timestamp = data.updatedAt_timestamp;
    if (data.department) userClass._department = data.department;

    return await userClass.find(options);
  }

  /**
   * Create a new user.
   * @param {string} userType - Type of user (from userTypes).
   * @param {Object} data - User data.
   * @param {string} data.registration_id - User registration ID.
   * @param {Object} data.name - User name.
   * @param {string} data.name.first_name - first name
   * @param {string} data.name.last_name - last name
   * @param {string} data.name.full_name - fullname name
   * @param {string} data.name.with_initial_name - lame with initial
   * @param {string} data.email - User email.
   * @param {Object} data.address - User address.
   * @param {string} data.address.line1 - address line one.
   * @param {string} [data.address.line2] - address line two (optional).
   * @param {string} data.address.zip - ZIP
   * @param {string} data.password - User password.
   * @param {string} [data.department] - Department (required for certain user types).
   * @returns {Promise<Object>} The newly created user object.
   */
  async createNewUser(userType, data = {}) {
    const builder = selectCorrectBuilder(userType);

    builder.registration_id = data.registration_id;
    builder.name = data.name;
    builder.email = data.email;
    builder.address = data.address;
    builder.password = data.password;

    if (
      userType == userTypes.USER_DEPARTMENT ||
      userType == userTypes.USER_STUDENT ||
      userType == userTypes.USER_LECTURER
    ) {
      builder._department = data.department;
    }
    return await builder.create();
  }

  /**
   * Delete a user by their database ID.
   * @param {string} userType - Type of user (from userTypes).
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<Object|null>} The deleted user object or null if not found.
   */
  async deleteUserById(userType, id) {
    const userClass = selectCorrectUser(userType);
    return await userClass.deleteById(id);
  }

  /**
   * Find a user by ID and update their data.
   * @param {string} userType - Type of user (from userTypes).
   * @param {Object} user - User object containing updates.
   * @returns {Promise<Object|null>} The updated user object.
   */
  async findByIdAndUpdate(userType, user) {
    const userClass = selectCorrectUser(userType);
    return await userClass.findByIdAndUpdate(user);
  }

  /**
   * Suspend or unsuspend a user.
   * @param {string} userType - Type of user (from userTypes).
   * @param {string} id - The ID of the user to update.
   * @param {boolean} enable - True to suspend, false to unsuspend.
   * @returns {Promise<Object|null>} The updated user object.
   */
  async setSuspend(userType, id, enable) {
    const userClass = selectCorrectUser(userType);
    return await userClass.findByIdAndUpdate({
      _id: id,
      enable_state: !enable,
    });
  }

  /**
   * Check if a user is suspended.
   * @param {Object} user - User object.
   * @returns {boolean} True if suspended, false otherwise.
   */
  isSuspended(user) {
    return !user.enable_state;
  }

  /**
   * Get all supported user types.
   * @returns {Array<string>} Array of user type strings.
   */
  userTypes() {
    return userTypes.USER_TYPES;
  }

  /**
   * Check if a user is an Admin.
   * @param {Object} admin - User object.
   * @returns {boolean} True if the user is an Admin.
   */
  isInstanceOfAdmin(admin) {
    return admin instanceof Admin && admin._type == userTypes.USER_ADMIN;
  }

  /**
   * Check if a user is a Department Head.
   * @param {Object} departmentHead - User object.
   * @returns {boolean} True if the user is a Department Head.
   */
  isInstanceOfDepartmentHead(departmentHead) {
    return (
      departmentHead instanceof DepartmentHead &&
      departmentHead._type == userTypes.USER_DEPARTMENT
    );
  }

  /**
   * Check if a user is a Lecturer.
   * @param {Object} lecturer - User object.
   * @returns {boolean} True if the user is a Lecturer.
   */
  isInstanceOfLecturer(lecturer) {
    return (
      lecturer instanceof Lecturer && lecturer._type == userTypes.USER_LECTURER
    );
  }

  /**
   * Check if a user is a Student.
   * @param {Object} student - User object.
   * @returns {boolean} True if the user is a Student.
   */
  isInstanceOfStudent(student) {
    return (
      student instanceof Student && student._type == userTypes.USER_STUDENT
    );
  }

  /**
   * Check if a user is null.
   * @param {Object} user - User object.
   * @returns {boolean} True if null user, false user.
   */
  isNullUser(user) {
    return user == NullUser;
  }
}

module.exports = UserService;
