import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Student, StudentProps } from "../../domain/entites/student";
import { StudentRepository } from "../../domain/repositories/user-repository";

export class InMemoryStudentRepository implements StudentRepository {
    constructor(public items: Student[] = []) {}

    async create(student: Student): Promise<void> {
        this.items.push(student)
    }

    async findById(studentId: UniqueEntityID): Promise<Student | null> {
        const student = this.items.find((item) => item.id.equals(studentId))
        if(!student){
            return null
        }
        return student
    }

    async findByEmail(email: string): Promise<Student | null> {
        const student = this.items.find((item) => item.email === email)
        if(!student){
            return null
        }
        return student
    }

    async update({ email, name, lastName, password }: Partial<StudentProps>, id: UniqueEntityID): Promise<Student | null> {
        const student = await this.findById(id)
        if(!student){
            return null
        }

        if(email){
            student.email = email
        }

        if(name){
            student.name = name
        }

        if(lastName){
            student.lastName = lastName
        }

        if(password){
            student.password = password
        }

        return student
        
    }

}