import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const userRequest = z.object({
    "email": z.string().email(),
    "id": z.string().uuid(),
    "iat": z.number()
})

type UserRequest = z.infer<typeof userRequest>

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify();
    request.user = payload as UserRequest;
  } catch (err) {
    console.log(err);
    return reply.status(401).send({ message: 'Unauthourized.' });
  }
}
