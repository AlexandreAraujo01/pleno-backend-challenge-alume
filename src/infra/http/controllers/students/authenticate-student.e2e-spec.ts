
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from '../../../../app';
import request from 'supertest';

beforeEach(async () => {
  await fastify.ready();
});

afterEach(async () => {
  await fastify.close();
});

describe('Route: /api/me | Method: POST | E2E Test', () => {
  it('should create a task', async () => {
    await request(fastify.server).post('/api/register').send({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    });

    const res = await request(fastify.server).post('/api/login').send({
      email: 'johndoe2@example.com',
      password: '123456',
    });
    expect(res.statusCode).toBe(200)
     expect(res.body).toEqual({ token: expect.any(String) })
  });
});
