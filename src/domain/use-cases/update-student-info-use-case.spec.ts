import { beforeEach, describe, expect, it } from "vitest";
import { GetStudentInfoUseCase } from "./get-student-info-use-case";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { studentFactory } from "../../test/factories/student-factory";
import { UpdateStudentInfoUseCase } from "./update-student-info-use-case";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { StudentNotFoundError } from "./errors/student-not-found";

let studentRepository: InMemoryStudentRepository
let sut: UpdateStudentInfoUseCase

describe('Get student info use case', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        sut = new UpdateStudentInfoUseCase(studentRepository)
    })

    it('should be able to update student info', async () => {
        const student = await studentFactory({name: 'John', email: 'johndoe@example.com'})
        studentRepository.items.push(student)

        const response = await sut.execute(
                            { name: 'Joan', email: 'joandoe@example.com' },
                            student.id
                            )

        expect(response.isRight())
        expect(response.value).toEqual(expect.objectContaining({
            email: 'joandoe@example.com',
            name: 'Joan'
    }))

    })

    it('should not update student info with invalid id', async () => {
        const student = await studentFactory({name: 'John', email: 'johndoe@example.com'})
        studentRepository.items.push(student)

        const response = await sut.execute(
                            { name: 'Joan', email: 'joandoe@example.com' },
                            new UniqueEntityID('fake-id')
                            )

        expect(response.isLeft())
        expect(response.value).toBeInstanceOf(StudentNotFoundError)
    })
})