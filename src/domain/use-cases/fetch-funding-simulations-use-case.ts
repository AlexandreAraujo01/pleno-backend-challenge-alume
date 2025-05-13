import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Either, left, right } from "../../core/types/either";
import { Funding } from "../entites/funding";
import { FundingRepository } from "../repositories/funding-repository";
import { StudentRepository } from "../repositories/user-repository";
import { StudentNotFoundError } from "./errors/student-not-found";

interface FetchFundingSimulationsUseCaseRequest {
    studentId: UniqueEntityID,
}

type FetchFundingSimulationsUseCaseResponse = Either<StudentNotFoundError, {fundings: Funding[]}>

export class FetchFundingSimulationsUseCase {
    constructor(private fundingRepository: FundingRepository, private studentRepository: StudentRepository){}

    async execute({studentId}: FetchFundingSimulationsUseCaseRequest ): Promise<FetchFundingSimulationsUseCaseResponse>{
        const student = await this.studentRepository.findById(studentId)
        if(!student){
            return left(new StudentNotFoundError())
        }
        const response = await this.fundingRepository.fetchFundingSimulation(studentId)
        return right({fundings: response})
    }
}