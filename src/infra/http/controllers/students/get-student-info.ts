import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaStudentRepository } from "../../../repositories/prisma-user-repository";
import { PrismaClient } from "../../../../prisma/generated/prisma";
import { GetStudentInfoUseCase } from "../../../../domain/use-cases/get-student-info-use-case";
import { StudentNotFoundError } from "../../../../domain/use-cases/errors/student-not-found";
import { studentPresenter } from "../../../presenters/student-presenter";


const userRequest = z.object({
    "email": z.string().email(),
    "id": z.string().uuid(),
    "iat": z.number()
})

type UserRequest = z.infer<typeof userRequest>

export async function studentInfoController(req: FastifyRequest, reply: FastifyReply) {
    const token = req.headers.authorization
    const user = req.user as UserRequest
    const prisma = new PrismaClient()
    const studentRepository = new PrismaStudentRepository(prisma)
    const getStudentInfoUseCase = new GetStudentInfoUseCase(studentRepository)
    const response = await getStudentInfoUseCase.execute({studentId: user.id})
    if(response.isLeft()){
        const error = response.value
        switch(error.constructor){
            case StudentNotFoundError:
                reply.status(404).send({message: error.message})
            default:
                reply.status(500).send({message: 'Bad Request'})
        }
    }
    else{
        return reply.status(200).send(studentPresenter(response.value))
    }

}