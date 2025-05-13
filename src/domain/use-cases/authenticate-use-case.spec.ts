import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate-use-case";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { FakeAuthService } from "../../test/services/fake-auth-service";
import { FakeTokenProvider } from "../../test/services/fake-token-provider";
import { studentFactory } from "../../test/factories/student-factory";
import { WrongCredentialsError } from "./errors/wrong-credentials";

let studentRepository: InMemoryStudentRepository
let authService: FakeAuthService
let tokenProvider: FakeTokenProvider
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        authService = new FakeAuthService()
        tokenProvider = new FakeTokenProvider()
        sut = new AuthenticateUseCase(studentRepository, authService, tokenProvider)
    })

    it('should be able to authenticate with valid credentials', async () => {
            const student = await studentFactory({name: 'John', lastName: 'Doe', email: 'johndoe@example.com', 'password': '123456'})
            studentRepository.items.push(student)
            const response = await sut.execute({email: 'johndoe@example.com', 'password': '123456'})
            expect(response.isRight()).toBe(true)
            expect(response.value).toEqual({token: expect.any(String)})
    })

    it('should not be allowed to authenticate with wrong password', async () => {
        const student = await studentFactory({name: 'John', lastName: 'Doe', email: 'johndoe@example.com', 'password': '123456'})
        studentRepository.items.push(student)
        const response = await sut.execute({email: 'johndoe@example.com', 'password': '123456789'})
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(WrongCredentialsError)
    })

     it('should not be allowed to authenticate with a non-existing email', async () => {
        const student = await studentFactory({name: 'John', lastName: 'Doe', email: 'johndoe@example.com', 'password': '123456'})
        studentRepository.items.push(student)
        const response = await sut.execute({email: 'johndoehary@example.com', 'password': '123456'})
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(WrongCredentialsError)
    })
})