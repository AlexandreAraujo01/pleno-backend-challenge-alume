import { AuthService } from "../../core/services/auth-service";
import { TokenProvider } from "../../core/services/token-service";
import { Either, left, right } from "../../core/types/either";
import { StudentRepository } from "../repositories/user-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials";

export interface AuthenticateUseCaseRequest {
    email: string,
    password: string
}

export type AuthenticateUseCaseResponse = Either<WrongCredentialsError, {token: string}>

export class AuthenticateUseCase {
    constructor(private studentRepository: StudentRepository, private authService: AuthService, private tokenProvider: TokenProvider) {}

    async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse>{
        const user = await this.studentRepository.findByEmail(email)
        if(!user){
            return left(new WrongCredentialsError())
        }
        const isSamePassword = await this.authService.comparePasswords(password, user.password)
        if(!isSamePassword){
            return left(new WrongCredentialsError())
        }

        const token = await this.tokenProvider.sign({email, id: user.id.toString()})

        return right({token});
    }
}