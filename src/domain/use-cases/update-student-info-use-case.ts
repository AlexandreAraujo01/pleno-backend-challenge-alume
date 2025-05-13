import { z } from "zod";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Either, left, right } from "../../core/types/either";
import { removeUndefined } from "../helpers/remove-undefined";
import { StudentRepository } from "../repositories/user-repository";
import { StudentNotFoundError } from "./errors/student-not-found";
import { Student } from "../entites/student";


interface  UpdateStudentInfoUseCaseRequest {
     name: string,
    email: string,
    lastName: string,
    password: string,

}

export type UpdateStudentInfoUseCaseResponse = Either<StudentNotFoundError, Student>


export class UpdateStudentInfoUseCase {
    constructor(private studentRepository: StudentRepository){}

    async execute(studentProps: Partial<UpdateStudentInfoUseCaseRequest>, id: UniqueEntityID): Promise<UpdateStudentInfoUseCaseResponse> {
        const propsWithouUndefined = removeUndefined(studentProps)
        const student = await this.studentRepository.update(propsWithouUndefined, id)
        if(!student){
            return left(new StudentNotFoundError())
        }
        return right(student)
    }
}