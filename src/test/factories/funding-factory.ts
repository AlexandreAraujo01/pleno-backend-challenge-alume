import { faker } from "@faker-js/faker";
import { Funding, FundingProps } from "../../domain/entites/funding";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";

export function fundingFactory(fundingProps: Partial<FundingProps>, id?: UniqueEntityID): Funding {
    return new Funding({
        installment_quantity: faker.number.int(),
        monthly_interest: faker.number.float({min: 0.01, max: 1.0}),
        total_value: faker.number.float(),
        student_id: new UniqueEntityID(faker.string.uuid()),
        ...fundingProps
    }, id)
}