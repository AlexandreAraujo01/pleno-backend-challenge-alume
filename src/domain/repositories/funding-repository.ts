import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Funding, FundingProps } from "../entites/funding";


export abstract class FundingRepository {

    abstract create(funding: Funding): Promise<void>

    abstract findById(fundingId: UniqueEntityID): Promise<Funding| null>

    abstract delete(fundingId: UniqueEntityID): Promise<Funding | null>

    abstract alter(fundingProps: Partial<FundingProps>, id: UniqueEntityID): Promise<Funding | null>

    abstract fetchFundingSimulation(studentId: UniqueEntityID): Promise<Funding[]>

}