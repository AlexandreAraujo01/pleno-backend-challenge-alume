import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Funding } from "../../domain/entites/funding";
import { Prisma, Funding as PrismaFunding } from "../../prisma/generated/prisma";

export class FundingMapper {

    static toPrisma(funding: Funding): Prisma.FundingUncheckedCreateInput {
        return {
            id: funding.id.toString(),
            studentId: funding.student.toString(),
            total_value: funding.total_value,
            installment_quantity: funding.installment_quantity,
            monthly_interest: funding.monthly_interest,
            monthly_installment_amount: funding.monthly_installment_amount
        }
    }

    static toDomain(prismaFunding: PrismaFunding): Funding {
        return new Funding({
            installment_quantity: prismaFunding.installment_quantity,
            monthly_interest: prismaFunding.monthly_interest,
            student_id: new UniqueEntityID(prismaFunding.studentId),
            total_value: prismaFunding.total_value
        }, new UniqueEntityID(prismaFunding.id))
    }
}