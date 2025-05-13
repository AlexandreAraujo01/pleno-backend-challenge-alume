import { Funding } from "../../domain/entites/funding";

interface fundingPresenter {
    id: string,
    installment_quantity: number
    monthly_interest: number,
    total_value: number,
    monthly_installment_amount: number


}

export function fundingPresenter(funding: Funding): fundingPresenter {
    return {
        id: funding.id.toString(),
        installment_quantity: funding.installment_quantity,
        monthly_interest: funding.monthly_interest,
        total_value: funding.total_value,
        monthly_installment_amount: funding.monthly_installment_amount
    }
}