const bcrypt = require('bcrypt');
const config = require('../config/');
const { InvalidPasswordProvided } = require('../errors');

/**
 * @class PasswordHashService
 * @classdesc
 * Service class to handle password hashing and verification using bcrypt.
 *
 * This class provides two main functionalities:
 * 1. Hashing plain text passwords securely using configurable salt rounds.
 * 2. Verifying a plain text password against a hashed password.
 *
 * The class throws a custom error (`InvalidPasswordProvided`) when
 * an invalid password is supplied for hashing. It relies on the
 * `Config` singleton for configuration values like `SALT_ROUNDS`.
 *
 * @example
 * const passwordHashService = require('./PasswordHashService');
 *
 * // Hash a password
 * const hashed = await passwordHashService.hashPassword('mySecret123');
 *
 * // Verify password
 * const isValid = await passwordHashService.verifyPassword('mySecret123', hashed);
 */
class PasswordHashService {
  /**
   * Hashes a plain text password using bcrypt with configured salt rounds.
   *
   * @async
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} Returns a promise that resolves to the hashed password.
   * @throws {InvalidPasswordProvided} If the password is not a valid non-empty string.
   *
   * @example
   * const hashedPassword = await passwordHashService.hashPassword('myPassword123');
   */
  async hashPassword(password) {
    if (typeof password !== 'string' || !password.trim()) {
      throw new InvalidPasswordProvided();
    }

    const saltRounds = Number(config.SLAT_ROUNDS) || 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifies a plain text password against a hashed password.
   *
   * @async
   * @param {string} password - The plain text password to verify.
   * @param {string} hashedPassword - The previously hashed password.
   * @returns {Promise<boolean>} Returns a promise that resolves to `true` if the password matches, otherwise `false`.
   *
   * @example
   * const isValid = await passwordHashService.verifyPassword('myPassword123', hashedPassword);
   */
  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new PasswordHashService();
