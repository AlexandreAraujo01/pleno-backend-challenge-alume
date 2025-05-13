import { beforeEach, describe, expect, it } from "vitest";
import { GetStudentInfoUseCase } from "./get-student-info-use-case";
import { StudentRepository } from "../repositories/user-repository";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { studentFactory } from "../../test/factories/student-factory";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { StudentNotFoundError } from "./errors/student-not-found";

let studentRepository: InMemoryStudentRepository
let sut: GetStudentInfoUseCase

describe('Get student info use case', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        sut = new GetStudentInfoUseCase(studentRepository)
    })

    it('should be able to get student info', async () => {
        const student = await studentFactory({name: 'John', email: 'johndoe@example.com'})
        studentRepository.items.push(student)

        const response = await sut.execute({studentId: student.id.toString()})
        expect(response.isRight()).toBe(true)
        expect(response.value).toEqual(expect.objectContaining({
            email: 'johndoe@example.com',
            name: 'John'
    }))

    })

    it('should not be allowed to get student info with non-existing id', async () => {
        const student = await studentFactory({name: 'John', email: 'johndoe@example.com'})
        studentRepository.items.push(student)

        const response = await sut.execute({studentId: new UniqueEntityID('fake-id').toString()})
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(StudentNotFoundError)
    })
})