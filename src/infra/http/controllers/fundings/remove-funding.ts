import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaClient } from "../../../../prisma/generated/prisma";
import { PrismaStudentRepository } from "../../../repositories/prisma-user-repository";
import { PrismaFundingRepository } from "../../../repositories/prisma-funding-repository";
import { UniqueEntityID } from "../../../../core/entites/unique-entity-id";
import { StudentNotFoundError } from "../../../../domain/use-cases/errors/student-not-found";
import { fundingPresenter } from "../../../presenters/funding-presenter";
import { FetchFundingSimulationsUseCase } from "../../../../domain/use-cases/fetch-funding-simulations-use-case";
import { RemoveFundingSimulationUseCase } from "../../../../domain/use-cases/remove-funding-simulation";
import { NotAllowedError } from "../../../../domain/use-cases/errors/not-allowed";

const userRequest = z.object({
    "email": z.string().email(),
    "id": z.string().uuid(),
    "iat": z.number()
})

export const removeFundingBodySchema = z.object({
    fundingId: z.string().uuid()
})

export type RemoveFundingBodySchema = z.infer<typeof removeFundingBodySchema>

type UserRequest = z.infer<typeof userRequest>


export async function removeFundingSimulationsController(req: FastifyRequest, reply: FastifyReply){
    const user = req.user as UserRequest
    const {fundingId} = req.body as RemoveFundingBodySchema
    const prisma = new PrismaClient()
    const studentRepository = new PrismaStudentRepository(prisma)
    const fundingRepository = new PrismaFundingRepository(prisma)
    const fetchFundingSimulationsUseCase = new RemoveFundingSimulationUseCase(fundingRepository, studentRepository)
    const response = await fetchFundingSimulationsUseCase.execute({studentId: new UniqueEntityID(user.id), fundingId: new UniqueEntityID(fundingId)})

    if(response.isLeft()){
        const error = response.value
        switch(error.constructor){
            case StudentNotFoundError:
                return reply.status(404).send({message: error.message})
            case NotAllowedError:
                return reply.status(403).send({message: error.message})
            default:
                return reply.status(500).send({message: 'Bad Request'})
        }
    }

    return reply.status(204).send()

}