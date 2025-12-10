/**
 * Helper class providing simplified access to token generation and verification
 * methods from the underlying AuthTokenService.
 *
 * This acts as a facade to isolate controllers/middleware from the internal
 * implementation details of the authentication subsystem.
 */
class AuthTokenServiceHelper {
  /**
   * @param {Object} authTokenService - Instance implementing token generation and verification.
   */
  constructor(authTokenService) {
    this.authTokenService = authTokenService;
  }

  /**
   * Generate a payload object to be used when creating access or refresh tokens.
   *
   * @param {string} userType - The type/category of the user (e.g., admin, student).
   * @param {string} id - Unique identifier of the user.
   * @param {number} expiresTimestamp - UNIX timestamp representing token expiration.
   * @param {number} [priority=0] - Optional request priority value.
   * @param {Object} [other={}] - Additional custom fields to include in the payload.
   * @returns {Object} The constructed JWT payload.
   */
  generatePayload(userType, id, expiresTimestamp, priority = 0, other = {}) {
    return this.authTokenService.generatePayload(
      userType,
      id,
      expiresTimestamp,
      (priority = 0),
      (other = {}),
    );
  }

  /**
   * Generate an access token based on the provided payload.
   *
   * @param {Object} payload - JWT payload data.
   * @returns {string} A signed JWT access token.
   */
  generateAccessToken(payload) {
    return this.authTokenService.generateAccessToken(payload);
  }

  /**
   * Generate a refresh token based on the provided payload.
   *
   * @param {Object} payload - JWT payload data.
   * @returns {string} A signed JWT refresh token.
   */
  generateRefreshToken(payload) {
    return this.authTokenService.generateRefreshToken(payload);
  }

  /**
   * Verify the integrity and validity of an access token.
   *
   * @param {string} token - Access token string.
   * @returns {Object} Decoded token payload on success.
   * @throws {Error} If the token is invalid or expired.
   */
  verifyAccessToken(token) {
    return this.authTokenService.verifyAccessToken(token);
  }

  /**
   * Verify the integrity and validity of a refresh token.
   *
   * @param {string} token - Refresh token string.
   * @returns {Object} Decoded token payload on success.
   * @throws {Error} If the token is invalid or expired.
   */
  verifyRefreshToken(token) {
    return this.authTokenService.verifyRefreshToken(token);
  }
}

/**
 * Helper class providing simplified access to password hashing
 * and password verification functionality.
 *
 * This isolates external layers from low-level hashing implementation details.
 */
class PasswordHashServiceHelper {
  /**
   * @param {Object} passwordHashService - Instance implementing hashing and verification operations.
   */
  constructor(passwordHashService) {
    this.passwordHashService = passwordHashService;
  }

  /**
   * Hash a plain-text password using a secure hashing algorithm.
   *
   * @param {string} password - Plain text password.
   * @returns {Promise<string>} Resolves to the hashed password.
   */
  async hashPassword(password) {
    return this.passwordHashService.hashPassword(password);
  }

  /**
   * Verify whether a plain-text password matches a hashed password.
   *
   * @param {string} password - Plain text password.
   * @param {string} hashedPassword - Previously hashed password.
   * @returns {Promise<boolean>} True if passwords match; otherwise false.
   */
  async verifyPassword(password, hashedPassword) {
    return this.passwordHashService.verifyPassword(password, hashedPassword);
  }
}

/**
 * Helper class that provides simplified access to user-related operations.
 *
 * This ensures presentation and controller layers do not directly depend on the
 * implementation details of the underlying UserAccountService.
 */
class UserServiceHelper {
  /**
   * @param {Object} userAccountService - Service instance that manages user retrieval and updates.
   */
  constructor(userAccountService) {
    this.userAccountService = userAccountService;
  }

  /**
   * Retrieve a user by ID and user type.
   *
   * @param {string} userType - Category/type of user.
   * @param {string} id - Unique user identifier.
   * @returns {Promise<Object|null>} User object or null if not found.
   */
  async getUserById(userType, id) {
    return this.userAccountService.getUserById(userType, id);
  }

  /**
   * Retrieve a user by email and user type.
   *
   * @param {string} userType - Category/type of user.
   * @param {string} email - User's email address.
   * @returns {Promise<Object|null>} User object or null if not found.
   */
  async getUserByEmail(userType, email, options = {}) {
    return this.userAccountService.getUserByEmail(userType, email, options);
  }

  /**
   * Update a user by ID.
   *
   * @param {string} userType - Category/type of user.
   * @param {Object} user - Updated user object containing modified fields.
   * @returns {Promise<Object>} Updated user document.
   */
  async findByIdAndUpdate(userType, user) {
    return this.userAccountService.findByIdAndUpdate(userType, user);
  }

  /**
   * Check if a user account is suspended.
   *
   * @param {Object} user - User object.
   * @returns {boolean} True if suspended, otherwise false.
   */
  isSuspended(user) {
    return this.userAccountService.isSuspended(user);
  }

  /**
   * Check if the supplied user object is null/undefined.
   *
   * @param {Object|null} user - User object.
   * @returns {boolean} True if user is null or invalid.
   */
  isNullUser(user) {
    return this.userAccountService.isNullUser(user);
  }
}

class CookieServiceHelper {
  constructor(cookieService) {
    this.cookieService = cookieService;
  }

  refreshTokenCookie(token, clear = false) {
    return this.cookieService.refreshTokenCookie(token, clear);
  }
}

module.exports = {
  AuthTokenServiceHelper,
  PasswordHashServiceHelper,
  UserServiceHelper,
  CookieServiceHelper,
};
