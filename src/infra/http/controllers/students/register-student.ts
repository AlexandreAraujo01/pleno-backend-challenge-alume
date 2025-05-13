import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterStudentUseCase } from "../../../../domain/use-cases/register-student-use-case";
import { PrismaStudentRepository } from "../../../repositories/prisma-user-repository";
import { PrismaClient } from "../../../../prisma/generated/prisma";
import { BcryptAuthService } from "../../services/bcrypt-auth-service";
import { UserAlreadyExistsError } from "../../../../domain/use-cases/errors/user-already-exists";


export const registerStudentBodySchema = z.object({
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    createdAt: z.date().optional()
})

export type RegisterStudentBodySchema = z.infer<typeof registerStudentBodySchema>


export async function registerStudentController(req: FastifyRequest, reply: FastifyReply) {
    const  {name, lastName, email, password, createdAt } = req.body as RegisterStudentBodySchema
    const prismaClient = new PrismaClient() 
    const studentRepository = new PrismaStudentRepository(prismaClient)
    const authService = new BcryptAuthService()
    const resgisterStudentUseCase = new RegisterStudentUseCase(studentRepository, authService)
    const response = await resgisterStudentUseCase.execute({name, lastName, email, password, createdAt})
    if(response.isLeft()){
        const error = response.value
        switch(error.constructor){
            case UserAlreadyExistsError:
                return reply.status(409).send({message: error.message})
            default:
                return reply.status(500).send({message: 'Bad Request'})
        }
    }
    return reply.status(201).send({message: 'User created'})
}