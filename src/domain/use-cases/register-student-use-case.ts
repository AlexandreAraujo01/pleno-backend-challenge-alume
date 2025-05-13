import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { AuthService } from "../../core/services/auth-service";
import { Either, left, right } from "../../core/types/either";
import { Student, StudentProps } from "../entites/student";
import { StudentRepository } from "../repositories/user-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

export type CreateStudentUseCaseResponse = Either<UserAlreadyExistsError, Student>;

export interface RegisterStudentUseCaseRequest {
    name: string,
    email: string,
    lastName: string,
    password: string,
    createdAt?: Date
}
export class RegisterStudentUseCase{
    constructor(private studentRepository: StudentRepository, private authService: AuthService) {}

    async execute({name, email, password, lastName, createdAt}: RegisterStudentUseCaseRequest, id?: UniqueEntityID): Promise<CreateStudentUseCaseResponse>{
        const userWithSameEmail = await this.studentRepository.findByEmail(email)
        if(userWithSameEmail){
            return left(new UserAlreadyExistsError())
        }

        const student = new Student({
            name,
            lastName,
            email,
            password: await this.authService.hashPassword(password),
            createdAt: createdAt ? createdAt : new Date(),

        },id)

        
        await this.studentRepository.create(student)
        return  right(student)
    }
}