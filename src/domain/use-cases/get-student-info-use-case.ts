import { z } from "zod";
import { StudentRepository } from "../repositories/user-repository";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Either, left, right } from "../../core/types/either";
import { StudentNotFoundError } from "./errors/student-not-found";
import { Student } from "../entites/student";

export const getStudentInfoUseCaseBodySchema = z.object({
    studentId: z.string()
})

export type GetStudentInfoUseCaseBodySchema = z.infer<typeof getStudentInfoUseCaseBodySchema>

export type GetStudentInfoUseCaseResponse = Either<StudentNotFoundError, Student>

export class GetStudentInfoUseCase {
    constructor(private studentRepository: StudentRepository) {}
    
    async execute({studentId}: GetStudentInfoUseCaseBodySchema): Promise<GetStudentInfoUseCaseResponse>{
        const student = await this.studentRepository.findById(new UniqueEntityID(studentId))
        if(!student){
            return left(new StudentNotFoundError())
        }
        return right(student)
    }

}