import { beforeEach, describe, expect, it } from "vitest";
import { RemoveFundingSimulationUseCase } from "./remove-funding-simulation";
import { StudentRepository } from "../repositories/user-repository";
import { FundingRepository } from "../repositories/funding-repository";
import { InMemoryStudentRepository } from "../../test/repositories/in-memory-student-repository";
import { InMemoryFundingRepository } from "../../test/repositories/in-memory-funding-repository";
import { studentFactory } from "../../test/factories/student-factory";
import { fundingFactory } from "../../test/factories/funding-factory";


let studentRepository: InMemoryStudentRepository
let fundingRepository: InMemoryFundingRepository
let sut : RemoveFundingSimulationUseCase

describe('Remove funding simulation', () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository()
        fundingRepository = new InMemoryFundingRepository()
        sut = new RemoveFundingSimulationUseCase(fundingRepository, studentRepository)
    })


    it('should be able to delete a funding simulation', async () => {
        const student = await studentFactory({name: 'John', email: 'johndoe@example.com'})
        studentRepository.items.push(student)

        const funding = fundingFactory({student_id: student.id})
        fundingRepository.items.push(funding)

        const response = await sut.execute({studentId: student.id, fundingId: funding.id})
        expect(response.isRight()).toBe(true)
        expect(fundingRepository.items).toHaveLength(0)
    })

})