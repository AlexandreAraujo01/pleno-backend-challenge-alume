import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Funding, FundingProps } from "../../domain/entites/funding";
import { removeUndefined } from "../../domain/helpers/remove-undefined";
import { FundingRepository } from "../../domain/repositories/funding-repository";
import { PrismaClient } from "../../prisma/generated/prisma";
import { FundingMapper } from "../mappers/funding-mapper";

export class PrismaFundingRepository implements FundingRepository {
    constructor(private prisma: PrismaClient){}

    async create(funding: Funding): Promise<void> {
        await this.prisma.funding.create({data: FundingMapper.toPrisma(funding)})
    }

    async findById(fundingId: UniqueEntityID): Promise<Funding | null> {
        const funding = await this.prisma.funding.findUnique({
            where: {
                id: fundingId.toString()
            }
        })
        if(!funding){
            return null
        }

        return FundingMapper.toDomain(funding)
    }

    async delete(fundingId: UniqueEntityID): Promise<Funding | null> {
        const funding = await this.prisma.funding.delete({
            where: {
                id: fundingId.toString()
            }
        })

        if(!funding){
            return null
        }

        return FundingMapper.toDomain(funding)
    }

    async alter(fundingProps: Partial<FundingProps>, id: UniqueEntityID): Promise<Funding | null> {
        
        const funding = await this.prisma.funding.update({
            data: removeUndefined(fundingProps),
            where: {
                id: id.toString()
            }
        })

        if(!funding){
            return null
        }

        return FundingMapper.toDomain(funding)
    }

    async fetchFundingSimulation(studentId: UniqueEntityID): Promise<Funding[]> {
        const fundings = await this.prisma.funding.findMany({
            where: {
                studentId: studentId.toString()
            }
        })

        return fundings.map((funding) => FundingMapper.toDomain(funding))
    }
    

}