

import { z } from 'zod';
import fastify from '../../../app';
import { TokenProvider } from '../../../core/services/token-service';

const userRequest = z.object({
    "email": z.string().email(),
    "id": z.string().uuid(),
    "iat": z.number()
})

type UserRequest = z.infer<typeof userRequest>

export class FastifyTokenProvider implements TokenProvider {
  sign(payload: UserRequest, options?: object): string {
    const token = fastify.jwt.sign(payload, {...options, expiresIn: '5m'});
    return token;
  }

}