
import request from 'supertest';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from '../../../../app';

beforeEach(async () => {
  await fastify.ready();
});

afterEach(async () => {
  await fastify.close();
});

describe('Route: /api/register | Method: POST | E2E Test', () => {
  it('should create a task', async () => {
    const res = await request(fastify.server).post('/api/register').send({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    });
    expect(res.statusCode).toBe(204);
  });
});
