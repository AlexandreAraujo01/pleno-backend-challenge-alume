import { beforeEach, describe, expect, it } from "vitest";
import { GetStudentInfoUseCase } from "./get-student-info-use-case";
import { StudentRepository } from "../repositories/user-repository";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { studentFactory } from "../../test/factories/student-factory";

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
        expect(response.isRight())
        expect(response.value).toEqual(expect.objectContaining({
            email: 'johndoe@example.com',
            name: 'John'
    }))

    })
})