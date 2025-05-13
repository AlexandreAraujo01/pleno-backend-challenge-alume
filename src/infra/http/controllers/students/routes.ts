import { FastifyInstance } from 'fastify';

import { ZodValidationHandler } from '../../../middlewares/zod-validation-middleware';
import { registerStudentBodySchema, registerStudentController } from './register-student';
import { verifyJWT } from '../../services/verify-jwt-service';
import { authenticateStudentBodySchema, authenticateStudentController } from './authenticate-student';
import { studentInfoController } from './get-student-info';
import { UpdateStudentInfoController, updateStudentInfoRequest } from './_update-student-info';

export async function studentRoutes(app: FastifyInstance) {
  app.post('/api/register', {
    handler: registerStudentController,
    preHandler: async (request, reply) => {
      await new ZodValidationHandler(registerStudentBodySchema).bodyHandle(
        request,
        reply,
      );
    },
  });

  app.post('/api/login', {
    handler: authenticateStudentController,
    preHandler: async (request, reply) => {
      await new ZodValidationHandler(authenticateStudentBodySchema).bodyHandle(
        request,
        reply,
      );
    },
  })

  app.post('/api/me', {
    handler: studentInfoController,
    onRequest: [verifyJWT]
  })

  app.put('/api/me', {
    handler: UpdateStudentInfoController,
    preHandler: async (request, reply) => {
      await new ZodValidationHandler(updateStudentInfoRequest).bodyHandle(
        request,
        reply,
      );
    },
    onRequest: [verifyJWT]
  })

}
