const authTokenServiceSupport = require('../../../src/services/authTokenService');
const jwt = require('jsonwebtoken');
const { config } = require('../../../src/config');
//const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = require('jsonwebtoken');
const {
  TokenExpiredError,
  JsonWebTokenError,
  TokenNotBefore,
  GeneralTokenError,
} = require('../../../src/errors/');
jest.mock('jsonwebtoken');

describe('authTokenServiceSupport Complete Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =======================
  // Singleton & Immutability
  // =======================
  describe('Singleton and Immutability', () => {
    test('should be a singleton', () => {
      const instance1 = require('../../../src/services/authTokenService');
      const instance2 = require('../../../src/services/authTokenService');
      expect(instance1).toBe(instance2);
    });

    test('should remain frozen and prevent property modifications', () => {
      expect(Object.isFrozen(authTokenServiceSupport)).toBe(true);
      authTokenServiceSupport.newProp = 123;
      expect(authTokenServiceSupport.newProp).toBeUndefined();
    });
  });

  // =======================
  // Payload Generation
  // =======================
  describe('generatePayload', () => {
    test('default priority', () => {
      const payload = authTokenServiceSupport.generatePayload(
        'admin',
        1,
        1234567890,
      );
      expect(payload).toEqual({
        userType: 'admin',
        id: 1,
        priority: 0,
        expiresTimestamp: 1234567890,
        other: {},
      });
    });

    test('custom priority and other fields', () => {
      const payload = authTokenServiceSupport.generatePayload(
        'student',
        2,
        987654321,
        5,
        { foo: 'bar' },
      );
      expect(payload).toEqual({
        userType: 'student',
        id: 2,
        priority: 5,
        expiresTimestamp: 987654321,
        other: { foo: 'bar' },
      });
    });
  });

  // =======================
  // Access Token Generation
  // =======================
  describe('generateAccessToken', () => {
    test('should generate access token', () => {
      const payload = { userType: 'admin', id: 1 };
      const fakeToken = 'fake.jwt.token';
      jwt.sign.mockReturnValue(fakeToken);

      const token = authTokenServiceSupport.generateAccessToken(payload);
      expect(token).toBe(fakeToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.ACCESS_TOKEN_TTL },
      );
    });
  });

  // =======================
  // Verify Token & JWT Errors
  // =======================
  describe('verifyAccessToken', () => {
    test('valid token', () => {
      const token = 'valid.token';
      const decoded = { id: 1, userType: 'admin' };
      jwt.verify.mockReturnValue(decoded);

      expect(authTokenServiceSupport.verifyAccessToken(token)).toEqual(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        config.ACCESS_TOKEN_SECRET,
      );
    });

    test('TokenExpiredError', () => {
      const token = 'expired.token';
      const error = new TokenExpiredError();
      jwt.verify.mockImplementation(() => {
        throw error;
      });
      expect(() => authTokenServiceSupport.verifyAccessToken(token)).toThrow(
        TokenExpiredError,
      );
    });

    test('JsonWebTokenError', () => {
      const token = 'invalid.token';
      const error = new JsonWebTokenError();
      jwt.verify.mockImplementation(() => {
        throw error;
      });
      expect(() => authTokenServiceSupport.verifyAccessToken(token)).toThrow(
        JsonWebTokenError,
      );
    });

    test('NotBeforeError', () => {
      const token = 'notactive.token';
      const error = new TokenNotBefore();
      error.name = 'NotBeforeError';
      jwt.verify.mockImplementation(() => {
        throw error;
      });
      expect(() => authTokenServiceSupport.verifyAccessToken(token)).toThrow(
        TokenNotBefore,
      );
    });
  });

  // =======================
  // High-strength Concurrency
  // =======================
  describe('Concurrency / Stress Tests', () => {
    test('1000 concurrent payloads', async () => {
      const tasks = Array.from({ length: 1000 }, (_, i) =>
        Promise.resolve(
          authTokenServiceSupport.generatePayload('user', i, i * 1000),
        ),
      );
      const results = await Promise.all(tasks);
      expect(results[0]).toEqual({
        userType: 'user',
        id: 0,
        priority: 0,
        expiresTimestamp: 0,
        other: {},
      });
      expect(results[999]).toEqual({
        userType: 'user',
        id: 999,
        priority: 0,
        expiresTimestamp: 999000,
        other: {},
      });
    });

    test('1000 concurrent tokens', async () => {
      jwt.sign.mockImplementation((payload) => `token-${payload.id}`);
      const payloads = Array.from({ length: 1000 }, (_, i) => ({
        userType: 'user',
        id: i,
      }));
      const tokens = await Promise.all(
        payloads.map((p) =>
          Promise.resolve(authTokenServiceSupport.generateAccessToken(p)),
        ),
      );
      expect(tokens[0]).toBe('token-0');
      expect(tokens[999]).toBe('token-999');
    });
  });

  // =======================
  // Efficiency / Memory
  // =======================
  describe('Performance / Memory', () => {
    test('payload generation efficiency', async () => {
      const start = process.hrtime.bigint();
      const tasks = Array.from({ length: 10000 }, (_, i) =>
        Promise.resolve(
          authTokenServiceSupport.generatePayload('user', i, i * 1000),
        ),
      );
      await Promise.all(tasks);
      const end = process.hrtime.bigint();
      console.log(
        `generatePayload 10,000 runs: ${(Number(end - start) / 1e6).toFixed(2)} ms`,
      );
    });

    test('access token generation efficiency', async () => {
      jwt.sign.mockImplementation((p) => `token-${p.id}`);
      const payloads = Array.from({ length: 10000 }, (_, i) => ({
        userType: 'user',
        id: i,
      }));
      const start = process.hrtime.bigint();
      await Promise.all(
        payloads.map((p) =>
          Promise.resolve(authTokenServiceSupport.generateAccessToken(p)),
        ),
      );
      const end = process.hrtime.bigint();
      console.log(
        `generateAccessToken 10,000 runs: ${(Number(end - start) / 1e6).toFixed(2)} ms`,
      );
    });

    test('memory usage', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      for (let i = 0; i < 10000; i++) {
        authTokenServiceSupport.generatePayload('user', i, i * 1000);
      }
      const finalMemory = process.memoryUsage().heapUsed;
      console.log(
        `Memory increase after 10,000 payloads: ${((finalMemory - initialMemory) / 1024 / 1024).toFixed(2)} MB`,
      );
      expect(finalMemory - initialMemory).toBeLessThan(5 * 1024 * 1024); // <5MB
    });
  });
});
