import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateStudentInfoUseCase } from "../../../../domain/use-cases/update-student-info-use-case";
import { PrismaStudentRepository } from "../../../repositories/prisma-user-repository";
import { PrismaClient } from "../../../../prisma/generated/prisma";
import { UniqueEntityID } from "../../../../core/entites/unique-entity-id";
import { StudentNotFoundError } from "../../../../domain/use-cases/errors/student-not-found";
import { fundingPresenter } from "../../../presenters/funding-presenter";
import { studentPresenter } from "../../../presenters/student-presenter";

export const updateStudentInfoRequest = z.object({
     name: z.string().optional(),
     email: z.string().optional(),
     lastName: z.string().optional(),
     password: z.string().optional(),
})

const userRequest = z.object({
    "email": z.string().email(),
    "id": z.string().uuid(),
    "iat": z.number()
})

type UpdateStudentInfoRequest = z.infer<typeof updateStudentInfoRequest>

type UserRequest = z.infer<typeof userRequest>

export async function UpdateStudentInfoController(req: FastifyRequest, reply: FastifyReply){
    const partialProps = req.body as UpdateStudentInfoRequest
    const user = req.user as UserRequest
    const prisma = new PrismaClient()
    const studentRepository = new PrismaStudentRepository(prisma)
    const updateStudentInfoUseCase = new UpdateStudentInfoUseCase(studentRepository)
    const response = await updateStudentInfoUseCase.execute(partialProps, new UniqueEntityID(user.id))
    if(response.isLeft()){
        const error = response.value
        switch(error.constructor){
            case StudentNotFoundError:
                return reply.status(404).send({message: error.message})
            default:
                return reply.status(500).send({message: 'Bad Request'})
        }
    }
    return reply.status(200).send(studentPresenter(response.value))

}