import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Either, left, right } from "../../core/types/either";
import { Funding } from "../entites/funding";
import { FundingRepository } from "../repositories/funding-repository";
import { StudentRepository } from "../repositories/user-repository";
import { NotAllowedError } from "./errors/not-allowed";
import { StudentNotFoundError } from "./errors/student-not-found";

interface RemoveFundingSimulationRequest {
    studentId: UniqueEntityID,
    fundingId: UniqueEntityID,
}

export type RemoveFundingSimulationResponse = Either<StudentNotFoundError | NotAllowedError, Funding>

export class RemoveFundingSimulationUseCase{
    constructor(private fundingRepository: FundingRepository, private studentRepository: StudentRepository){}

    async execute({fundingId, studentId} : RemoveFundingSimulationRequest): Promise<RemoveFundingSimulationResponse>{
        const student = await this.studentRepository.findById(studentId)
        if(!student){
            return left(new StudentNotFoundError())
        }
        const funding = await this.fundingRepository.findById(fundingId)
        if(!funding){
            return left(new NotAllowedError())
        }

        const isSameStudentId = studentId.equals(funding.student)
        if(!isSameStudentId){   
            return left(new NotAllowedError())
        }

        await this.fundingRepository.delete(fundingId)
        return right(funding)
    }
}