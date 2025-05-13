import { beforeEach, describe, expect, it } from "vitest";
import { CreateFundingSimulationUseCase } from "./create-funding-simulation";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { InMemoryFundingRepository } from "../../test/repositories/in-memory-funding-repository";
import { studentFactory } from "../../test/factories/student-factory";
import { StudentNotFoundError } from "./errors/student-not-found";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed";

let studentRepository: InMemoryStudentRepository
let fundingRepository: InMemoryFundingRepository
let sut: CreateFundingSimulationUseCase

describe('Create funding simulation use case', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        fundingRepository = new InMemoryFundingRepository()
        sut = new CreateFundingSimulationUseCase(fundingRepository, studentRepository)
    })

    it('should be able to create a new funding simulation', async () => {
        const student = await studentFactory({name: 'John', email: 'john@example.com'})
        studentRepository.items.push(student)
        const response = await sut.execute({
                student_id: student.id,
                installment_quantity: 12,
                monthly_interest: 0.02,
                total_value: 2500,
            })
        expect(response.isRight()).toBe(true)
        expect(fundingRepository.items[0].student).toEqual(student.id)
        expect(fundingRepository.items[0].monthly_installment_amount).toEqual(236.40)
    })

    it('should not be allowed to create a new funding simulation with an invalid id', async () => {
        const student = await studentFactory({name: 'John', email: 'john@example.com'})
        studentRepository.items.push(student)
        const response = await sut.execute({
                student_id: new UniqueEntityID('fake-id'),
                installment_quantity: 12,
                monthly_interest: 0.02,
                total_value: 2500,
            })
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(StudentNotFoundError)
    })

    it('should not be allowed to create a new funding simulation with negative parameters', async () => {
        const student = await studentFactory({name: 'John', email: 'john@example.com'})
        studentRepository.items.push(student)
        const response = await sut.execute({
                student_id: student.id,
                installment_quantity: -12,
                monthly_interest: 0.02,
                total_value: -2500,
            })
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(NotAllowedError)
    })
})