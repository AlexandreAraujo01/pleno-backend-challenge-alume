import { FastifyInstance } from 'fastify';
import { ZodValidationHandler } from '../../../middlewares/zod-validation-middleware';
import { verifyJWT } from '../../services/verify-jwt-service';
import { createFundingBodySchema, createFundingController } from './create-funding';
import { fetchFundingSimulationsController } from './fetch-fundings';
import { removeFundingBodySchema, removeFundingSimulationsController } from './remove-funding';

export async function fundingRoutes(app: FastifyInstance) {

  app.post('/api/simulations', {
    handler: createFundingController,
    preHandler: async (request, reply) => {
      await new ZodValidationHandler(createFundingBodySchema).bodyHandle(
        request,
        reply,
      );
    },
    onRequest: [verifyJWT]
  })

  app.get('/api/simulations', {
    handler: fetchFundingSimulationsController,
    onRequest: [verifyJWT]
  })

   app.delete('/api/simulations', {
    handler: removeFundingSimulationsController,
    preHandler: async (request, reply) => {
      await new ZodValidationHandler(removeFundingBodySchema).bodyHandle(
        request,
        reply,
      );
    },
    onRequest: [verifyJWT]
  })


}
