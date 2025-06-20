
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fastify from '../../../../app';
import request from 'supertest';

beforeEach(async () => {
  await fastify.ready();
});

afterEach(async () => {
  await fastify.close();
});

describe('Route: /api/simulations | Method: Get | E2E Test', () => {
  it('should create a task', async () => {
    await request(fastify.server).post('/api/register').send({
      name: 'John',
      lastName: 'Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    });
    
    const tokenResponse = await request(fastify.server).post('/api/login').send({
      email: 'johndoe2@example.com',
      password: '123456',
    });

    const token = tokenResponse.body.token

     await request(fastify.server).post('/api/simulations').set('Authorization', `Bearer ${token}`).send({
	   "installment_quantity": "12",
        "monthly_interest": "0.02",
        "total_value": "2500"
    });

    const res = await request(fastify.server).get('/api/simulations').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
        fundings: [expect.objectContaining({
            monthly_installment_amount: 236.4
        })
    ]
    })
  });
});
