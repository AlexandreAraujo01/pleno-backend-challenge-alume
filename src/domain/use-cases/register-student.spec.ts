import {describe, beforeEach, it, expect} from 'vitest'
import { RegisterStudentUseCase } from './register-student-use-case'
import { InMemoryStudentRepository } from '../../test/repositories/in-memory-student-repository'
import { FakeAuthService } from '../../test/services/fake-auth-service'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let sut: RegisterStudentUseCase
let studentRepository: InMemoryStudentRepository
let authService: FakeAuthService
describe('Register Student Use Case', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        authService = new FakeAuthService()
        sut = new RegisterStudentUseCase(studentRepository, authService)
    })

    it('should be able to create a new student account', async () => {
        const response = await sut.execute({name: 'John', email: 'johndoe@example.com', lastName: 'Doe', password: '123456'})
        expect(response.isRight()).toBe(true)
        expect(studentRepository.items[0].email).toEqual('johndoe@example.com')
        
    })

    it('should hash password upon registration', async () => {
        const response = await sut.execute({name: 'John', email: 'johndoe@example.com', lastName: 'Doe', password: '123456'})
        expect(response.isRight()).toBe(true)
        expect(studentRepository.items[0].password).toEqual('123456-hashed')
    })

    it('should not be allowed to register a user with duplicated email', async () => {
        await sut.execute({name: 'John', email: 'johndoe@example.com', lastName: 'Doe', password: '123456'})
        const response = await sut.execute({name: 'joan', email: 'johndoe@example.com', lastName: 'Darc', password: '123456'})
        expect(response.isLeft())
        expect(response.value).toBeInstanceOf(UserAlreadyExistsError)
    })
})