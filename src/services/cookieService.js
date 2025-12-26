const cookie = require('cookie');
const { config, envTypes } = require('../config/');

/**
 * @class CookieService
 * @classdesc
 * A utility service for handling HTTP cookies in a Node.js environment.
 * This class provides methods to create and clear cookies, specifically
 * designed for managing authentication tokens (e.g., refresh tokens) in a
 * secure, maintainable, and reusable way. Cookies are configured with
 * HttpOnly, Secure, and SameSite attributes for production-grade security.
 */
class CookieService {
  /**
   * Creates a serialized Set-Cookie string for a refresh token.
   * Can also generate a string to clear the cookie from the browser.
   *
   * @static
   * @param {string|null} token - The token value to set in the cookie.
   *                              If clearing the cookie, this can be `null`.
   * @param {boolean} [clear=false] - If true, generates a cookie string that clears
   *                                   the cookie in the browser.
   * @returns {string} Serialized Set-Cookie string that can be used in HTTP response headers.
   *
   * @example
   * // Create a cookie with a refresh token
   * const cookieStr = CookieService.refreshTokenCookie('myRefreshToken');
   * res.setHeader('Set-Cookie', cookieStr);
   *
   * @example
   * // Clear the cookie (e.g., on logout)
   * const clearCookieStr = CookieService.refreshTokenCookie(null, true);
   * res.setHeader('Set-Cookie', clearCookieStr);
   *
   * @remarks
   * - The cookie is HttpOnly to prevent access via client-side JavaScript.
   * - The cookie is Secure in production environments to enforce HTTPS.
   * - The cookie uses SameSite=Strict to prevent CSRF attacks.
   * - The cookie path is fixed at '/auth/token' for consistency.
   * - maxAge is set to zero when clearing the cookie to instruct the browser to remove it.
   */
  static refreshTokenCookie(token, clear = false) {
    const ttlSeconds = Number.parseInt(config.REFRESH_TOKEN_COOKIE_TTL, 10);
    if (!Number.isInteger(ttlSeconds))
      throw new Error(
        'Invalid REFRESH_TOKEN_COOKIE_TTL: must be a number of seconds.',
      );

    return cookie.serialize('token', clear ? '' : token, {
      httpOnly: true,
      secure: config.NODE_ENV === envTypes.PRODUCTION,
      sameSite: 'Strict',
      path: '/auth/token',
      maxAge: clear ? 0 : ttlSeconds,
    });
  }
}

module.exports = CookieService;
