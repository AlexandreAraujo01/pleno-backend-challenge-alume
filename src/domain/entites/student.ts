import { Entity } from "../../core/entites/entity";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";

export interface StudentProps {
    name: string
    lastName: string
    email: string
    password: string
    createdAt?: Date
}

export class Student extends Entity<StudentProps> {
    constructor(props: StudentProps, id?: UniqueEntityID){
        super(props, id)
    }

    get name(){
        return this.props.name
    }

    set name(newName: string){
        this.props.name = newName
    }

    get lastName(){
        return this.props.lastName
    }

    set lastName(newLastName){
        this.props.lastName = newLastName
    }

    get email(){
        return this.props.email
    }

    set email(newEmail: string){
        this.props.email = newEmail
    }

    get password(){
        return this.props.password
    }

    set password(newPassword){
        this.props.password = newPassword
    }

    get createdAt(){
        return this.props.createdAt
    }

}