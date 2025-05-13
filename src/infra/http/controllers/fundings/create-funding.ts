import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateFundingSimulationUseCase } from "../../../../domain/use-cases/create-funding-simulation";
import { PrismaClient } from "../../../../prisma/generated/prisma";
import { PrismaStudentRepository } from "../../../repositories/prisma-user-repository";
import { FundingRepository } from "../../../../domain/repositories/funding-repository";
import { PrismaFundingRepository } from "../../../repositories/prisma-funding-repository";
import { UniqueEntityID } from "../../../../core/entites/unique-entity-id";
import { StudentNotFoundError } from "../../../../domain/use-cases/errors/student-not-found";
import { fundingPresenter } from "../../../presenters/funding-presenter";

const userRequest = z.object({
    "email": z.string().email(),
    "id": z.string().uuid(),
    "iat": z.number()
})

type UserRequest = z.infer<typeof userRequest>


export const createFundingBodySchema = z.object({
    installment_quantity: z.coerce.number().int().min(1),
    monthly_interest: z.coerce.number().min(0.01),
    total_value: z.coerce.number().min(1)
})

export type CreateFundingBodySchema = z.infer<typeof createFundingBodySchema>

export async function createFundingController(req: FastifyRequest, reply: FastifyReply){
    const user = req.user as UserRequest
    const {installment_quantity, monthly_interest, total_value} = req.body  as CreateFundingBodySchema
    const prisma = new PrismaClient()
    const studentRepository = new PrismaStudentRepository(prisma)
    const fundingRepository = new PrismaFundingRepository(prisma)
    const createFundingSimulationUseCase = new CreateFundingSimulationUseCase(fundingRepository, studentRepository)
    const response = await createFundingSimulationUseCase.execute({
        student_id: new UniqueEntityID(user.id),
        installment_quantity,
        monthly_interest,
        total_value
    })

    if(response.isLeft()){
        const error = response.value
        switch(error.constructor){
            case StudentNotFoundError:
                return reply.status(403).send({message: error.message})
            default:
                return reply.status(500).send({message: 'Bad Request'})
        }
    }

    return reply.status(200).send({'funding': fundingPresenter(response.value)})

}