const { userTypes } = require('../../config');
const AdminBuilder = require('../../classes/USERS/AdminBuilder');
const DepartmentHeadBuilder = require('../../classes/USERS/DepartmentHeadBuilder');
const LecturerBuilder = require('../../classes/USERS/LecturerBuilder');
const StudentBuilder = require('../../classes/USERS/StudentBuilder');

const {
  Admin,
  DepartmentHead,
  Lecturer,
  Student,
} = require('../../classes/USERS');

/**
 * @typedef {import('../../classes/USERS/AdminBuilder')} AdminBuilder
 * @typedef {import('../../classes/USERS/DepartmentHeadBuilder')} DepartmentHeadBuilder
 * @typedef {import('../../classes/USERS/LecturerBuilder')} LecturerBuilder
 * @typedef {import('../../classes/USERS/StudentBuilder')} StudentBuilder
 *
 * @typedef {import('../../classes/USERS/Admin')} Admin
 * @typedef {import('../../classes/USERS/DepartmentHead')} DepartmentHead
 * @typedef {import('../../classes/USERS/Lecturer')} Lecturer
 * @typedef {import('../../classes/USERS/Student')} Student
 */

/**
 * Mapping of user types to their corresponding builder classes.
 * Used to dynamically instantiate the correct builder for creating user objects.
 *
 * @type {Object<string, typeof AdminBuilder | typeof DepartmentHeadBuilder | typeof LecturerBuilder | typeof StudentBuilder>}
 */
const buildersMap = {
  [userTypes.USER_STUDENT]: StudentBuilder,
  [userTypes.USER_LECTURER]: LecturerBuilder,
  [userTypes.USER_DEPARTMENT]: DepartmentHeadBuilder,
  [userTypes.USER_ADMIN]: AdminBuilder,
};

/**
 * Mapping of user types to their corresponding user model classes.
 * Used to dynamically retrieve user model instances for database operations.
 *
 * @type {Object<string, typeof Admin | typeof DepartmentHead | typeof Lecturer | typeof Student>}
 */
const userClassMap = {
  [userTypes.USER_STUDENT]: Student,
  [userTypes.USER_LECTURER]: Lecturer,
  [userTypes.USER_DEPARTMENT]: DepartmentHead,
  [userTypes.USER_ADMIN]: Admin,
};

/**
 * Returns a new instance of the correct user builder class depending on the user type.
 * Builders encapsulate validation, transformation, and creation logic for each user role.
 *
 * @param {string} userType - A valid user type defined in `userTypes`.
 * @returns {AdminBuilder | DepartmentHeadBuilder | LecturerBuilder | StudentBuilder}
 * @throws {Error} If the user type does not match any known builder.
 *
 * @example
 * const builder = selectCorrectBuilder(userTypes.USER_ADMIN);
 * builder.name = "John Doe";
 * const newUser = await builder.create();
 */
function selectCorrectBuilder(userType) {
  const BuilderClass = buildersMap[userType];
  if (!BuilderClass) throw new Error('undefined user type');
  return new BuilderClass();
}

/**
 * Returns a new instance of the correct user class depending on the user type.
 * This is typically used for database operations such as find, update, or delete.
 *
 * @param {string} userType - A valid user type defined in `userTypes`.
 * @returns {Admin | DepartmentHead | Lecturer | Student}
 * @throws {Error} If the user type does not match any known user model.
 *
 * @example
 * const userModel = selectCorrectUser(userTypes.USER_STUDENT);
 * const student = await userModel.findById(studentId);
 */
function selectCorrectUser(userType) {
  const userClass = userClassMap[userType];
  if (!userClass) throw new Error('undefined user type');
  return new userClass();
}

/**
 * Constructs a standardized name object.
 * Useful for creating structured name fields across different user types.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} fullName - The full official name of the user.
 * @param {string} nameWithInitial - The abbreviated name (e.g., "J. Doe").
 * @returns {{first_name: string, last_name: string, full_name: string, with_initial_name: string}}
 *
 * @example
 * const nameObj = setNames("John", "Doe", "John Doe", "J. Doe");
 */
function setNames(firstName, lastName, fullName, nameWithInitial) {
  return {
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    with_initial_name: nameWithInitial,
  };
}

/**
 * Constructs a standardized address object.
 * Useful to ensure consistent address structuring for all user profiles.
 *
 * @param {string} addressLine1 - Primary address line.
 * @param {string} addressLine2 - Secondary address line (optional).
 * @param {string|number} zip - ZIP or postal code.
 * @returns {{line1: string, line2: string, zip: string|number}}
 *
 * @example
 * const address = setAddress("123 Main St", "Apt 4B", "90210");
 */
function setAddress(addressLine1, addressLine2, zip) {
  return { line1: addressLine1, line2: addressLine2, zip: zip };
}

module.exports = {
  selectCorrectBuilder,
  setNames,
  setAddress,
  selectCorrectUser,
};
