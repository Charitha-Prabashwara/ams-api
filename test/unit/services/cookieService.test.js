const cookie = require('cookie');
const CookieService = require('../../../src/services/cookieService');
const { config, envTypes } = require('../../../src/config');

jest.mock('cookie');

jest.mock('../../../src/config', () => ({
  config: {
    NODE_ENV: 'PRODUCTION',
    REFRESH_TOKEN_COOKIE_TTL: 3600,
  },
  envTypes: {
    PRODUCTION: 'PRODUCTION',
    DEVELOPMENT: 'DEVELOPMENT',
    TEST: 'TEST',
  },
}));

describe('CookieService.refreshTokenCookie', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create cookie string with provided token', () => {
    const token = 'TEST_REFRESH_TOKEN';

    // Mock cookie.serialize return value
    cookie.serialize.mockReturnValue('serialized_cookie_string');

    const result = CookieService.refreshTokenCookie(token, false);

    expect(cookie.serialize).toHaveBeenCalledWith(
      'token',
      token,
      expect.objectContaining({
        httpOnly: true,
        secure: config.NODE_ENV === envTypes.PRODUCTION,
        sameSite: 'Strict',
        path: '/auth/token',
        maxAge: config.REFRESH_TOKEN_COOKIE_TTL,
      }),
    );

    expect(result).toBe('serialized_cookie_string');
  });

  test('should clear cookie when clear flag is true', () => {
    cookie.serialize.mockReturnValue('clear_cookie_string');

    const result = CookieService.refreshTokenCookie(null, true);

    expect(cookie.serialize).toHaveBeenCalledWith(
      'token',
      '',
      expect.objectContaining({
        httpOnly: true,
        secure: config.NODE_ENV === envTypes.PRODUCTION,
        sameSite: 'Strict',
        path: '/auth/token',
        maxAge: 0,
      }),
    );

    expect(result).toBe('clear_cookie_string');
  });

  test('should set secure=true when environment is PRODUCTION', () => {
    const originalEnv = config.NODE_ENV;
    config.NODE_ENV = envTypes.PRODUCTION;

    cookie.serialize.mockReturnValue('cookie_secure');

    CookieService.refreshTokenCookie('tok');

    expect(cookie.serialize).toHaveBeenCalledWith(
      'token',
      'tok',
      expect.objectContaining({
        secure: true,
      }),
    );

    config.NODE_ENV = originalEnv; // restore
  });

  test('should set secure=false when environment is not PRODUCTION', () => {
    const originalEnv = config.NODE_ENV;
    config.NODE_ENV = envTypes.DEVELOPMENT; // Example

    cookie.serialize.mockReturnValue('cookie_not_secure');

    CookieService.refreshTokenCookie('tok');

    expect(cookie.serialize).toHaveBeenCalledWith(
      'token',
      'tok',
      expect.objectContaining({
        secure: false,
      }),
    );

    config.NODE_ENV = originalEnv; // restore
  });

  test('should always set httpOnly, sameSite, and path correctly', () => {
    cookie.serialize.mockReturnValue('generic_cookie');

    CookieService.refreshTokenCookie('x');

    const call = cookie.serialize.mock.calls[0][2];

    expect(call.httpOnly).toBe(true);
    expect(call.sameSite).toBe('Strict');
    expect(call.path).toBe('/auth/token');
  });
});
