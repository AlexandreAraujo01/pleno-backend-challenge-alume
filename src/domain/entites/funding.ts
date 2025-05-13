import { Entity } from "../../core/entites/entity";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";


export interface FundingProps {
    student_id: UniqueEntityID,
    total_value: number,
    installment_quantity: number,
    monthly_interest: number,
}

export class Funding extends Entity<FundingProps> {
    constructor(props: FundingProps, id?: UniqueEntityID){
        super(props, id)
    }

    get student(){
        return this.props.student_id
    }

    set student(id: UniqueEntityID){
        this.props.student_id = id
    }

    get total_value(){
        return this.props.total_value
    }

    set total_value(amount: number){
        this.props.total_value = amount
    }

    get installment_quantity(){
        return this.props.installment_quantity
    }

    set installment_quantity(installment_quantity: number){
        this.props.installment_quantity = installment_quantity
    }

    get monthly_interest(){
        return this.props.monthly_interest
    }

     set monthly_interest(monthly_interest: number){
        this.props.monthly_interest = monthly_interest
    }

    get monthly_installment_amount(){
        return this.calculateInstallments()
    }


    calculateInstallments() {
    const i = this.props.monthly_interest;
    const n = this.props.installment_quantity;
    const pv = this.props.total_value;

    const pmt = pv * (i / (1 - Math.pow(1 + i, -n)));
    return Number(pmt.toFixed(2));
}

}
