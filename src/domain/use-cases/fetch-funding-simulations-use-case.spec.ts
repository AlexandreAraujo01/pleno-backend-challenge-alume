import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { InMemoryFundingRepository } from "../../test/repositories/in-memory-funding-repository";
import { FetchFundingSimulationsUseCase } from "./fetch-funding-simulations-use-case";
import { studentFactory } from "../../test/factories/student-factory";
import { fundingFactory } from "../../test/factories/funding-factory";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { StudentNotFoundError } from "./errors/student-not-found";


let studentRepository: InMemoryStudentRepository
let fundingRepository: InMemoryFundingRepository
let sut: FetchFundingSimulationsUseCase

describe('Fetch funding simulations use case', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        fundingRepository = new InMemoryFundingRepository()
        sut = new FetchFundingSimulationsUseCase(fundingRepository, studentRepository)
    })

    it('should be able to fetch funding simulations', async () => {
        const student = await studentFactory({name: 'John', lastName: 'Doe'})
        studentRepository.items.push(student)
        const funding = fundingFactory({student_id: student.id, installment_quantity: 12,  monthly_interest: 0.02, total_value: 2500})
        fundingRepository.items.push(funding)
        const response = await  sut.execute({studentId: student.id})
        expect(response.isRight()).toBe(true)
        if(response.isRight()){
            expect(response.value.fundings[0].student).toEqual(student.id)
            expect(response.value.fundings[0].monthly_installment_amount).toEqual(236.40)
        }
    })

    it('should not be allowed to fetch funding simulations with a non-existing id', async () => {
        const student = await studentFactory({name: 'John', lastName: 'Doe'})
        studentRepository.items.push(student)
        const funding = fundingFactory({student_id: student.id, installment_quantity: 12,  monthly_interest: 0.02, total_value: 2500})
        fundingRepository.items.push(funding)
        const response = await  sut.execute({studentId: new UniqueEntityID('fake-id')})
        expect(response.isLeft()).toBe(true)
        expect(response.value).toBeInstanceOf(StudentNotFoundError)
    })

})