import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";
import { AuthenticateUseCase } from "../../../../domain/use-cases/authenticate-use-case";
import { PrismaStudentRepository } from "../../../repositories/prisma-user-repository";
import { PrismaClient } from "../../../../prisma/generated/prisma";
import { BcryptAuthService } from "../../services/bcrypt-auth-service";
import { FastifyTokenProvider } from "../../services/fastify-token-service";
import { WrongCredentialsError } from "../../../../domain/use-cases/errors/wrong-credentials";

export const authenticateStudentBodySchema = z.object({
     email: z.string().email(),
     password: z.string()
})

export type AuthenticateStudentBodySchema = z.infer<typeof authenticateStudentBodySchema>

export async function authenticateStudentController(req: FastifyRequest, reply: FastifyReply) {
    const {email, password} = req.body as AuthenticateStudentBodySchema
    const prisma = new PrismaClient()
    const studentRepository = new PrismaStudentRepository(prisma)
    const authService = new BcryptAuthService()
    const tokenProvider = new FastifyTokenProvider()
    const authenticateUseCase = new AuthenticateUseCase(studentRepository, authService, tokenProvider)
    const response = await authenticateUseCase.execute({email, password})
    if(response.isLeft()){
        const error = response.value
        switch(error.constructor){
            case WrongCredentialsError:
                return reply.status(401).send({message: error.message})
            default:
                return reply.status(500).send({message: 'Bad Request'})
        }
    }

    return reply.status(200).send(response.value)

}