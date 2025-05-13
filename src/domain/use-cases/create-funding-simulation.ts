import { Either, left, right } from "../../core/types/either";
import { Funding, FundingProps } from "../entites/funding";
import { FundingRepository } from "../repositories/funding-repository";
import { StudentRepository } from "../repositories/user-repository";
import { NotAllowedError } from "./errors/not-allowed";
import { StudentNotFoundError } from "./errors/student-not-found";

export type CreateStudentUseCaseResponse = Either<StudentNotFoundError | NotAllowedError, Funding>;


export class CreateFundingSimulationUseCase {
    constructor(private fundingRepository: FundingRepository, 
                private studentRepository: StudentRepository){}

    
    async execute({student_id, total_value, monthly_interest, installment_quantity} : FundingProps): Promise<CreateStudentUseCaseResponse>{
        const student =  await this.studentRepository.findById(student_id)
        if(!student){
            return left(new StudentNotFoundError())
        }

        if(total_value < 0 || monthly_interest < 0 || installment_quantity < 0){
            return left(new NotAllowedError())
        }

        const funding = new Funding({
            student_id,
            installment_quantity,
            monthly_interest,
            total_value,
        })

        await this.fundingRepository.create(funding)

        return right(funding)

    }

}