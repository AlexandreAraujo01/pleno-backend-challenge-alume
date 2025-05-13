import Fastify from 'fastify';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { studentRoutes } from './infra/http/controllers/students/routes';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Registre as rotas
fastify.register(studentRoutes)



async function start() {
  if (process.env.MODE !== 'test') {
    try {
      const address = await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
      console.log(`Server is now listening on ${address}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
}

start();

export default fastify;
