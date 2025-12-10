const request = require('supertest');
const app = require('../../../src/app');

describe('Test Express API', () => {
  test('GET /Check api working..', async () => {
    const start = Date.now();
    const response = await request(app).get('/api/v1/');
    const duration = Date.now() - start;

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('api/v1 is working...');
    //expect(duration).toBeLessThan(100);
  }, 20000);
});
