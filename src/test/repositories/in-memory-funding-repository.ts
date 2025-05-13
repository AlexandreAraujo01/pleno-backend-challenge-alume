import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Funding, FundingProps } from "../../domain/entites/funding";
import { FundingRepository } from "../../domain/repositories/funding-repository";

export class InMemoryFundingRepository extends FundingRepository {
   
    
    public items: Funding[] = []

    async create(funding: Funding): Promise<void> {
        this.items.push(funding)
    }

    async findById(fundingId: UniqueEntityID): Promise<Funding | null> {
        const funding = this.items.find((item) => item.id.equals(fundingId))
        if(!funding){
            return null
        }

        return funding
    }

    async delete(fundingId: UniqueEntityID): Promise<Funding | null> {
        const fundingIndex = this.items.findIndex((item) => item.id.equals(fundingId))
        if(fundingIndex < 0){
            return null
        }
        const funding = this.items[fundingIndex]
        this.items.splice(fundingIndex, 1)
        return funding
       

        
    }

     async alter(fundingProps: Partial<FundingProps>, id: UniqueEntityID): Promise<Funding | null> {
        const {total_value, monthly_interest, installment_quantity} = fundingProps
        const fundingIndex = this.items.findIndex((item => item.id.equals(id)))
        
        if(fundingIndex < 0){
            return null
        }

        const funding = this.items[fundingIndex]

        if(total_value){
            funding.total_value = total_value
        }

        if(monthly_interest){
            funding.monthly_interest = monthly_interest
        }

        if(installment_quantity){
            funding.installment_quantity = installment_quantity
        }

        this.items[fundingIndex] = funding

        return funding

    }


    async fetchFundingSimulation(studentId: UniqueEntityID): Promise<Funding[]> {
        const fundings = this.items.filter((item) => item.student.equals(studentId))
        return fundings
    }

}