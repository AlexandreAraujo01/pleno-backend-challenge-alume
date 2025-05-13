import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Student, StudentProps } from "../../domain/entites/student";
import { StudentRepository } from "../../domain/repositories/user-repository";
import { PrismaClient } from "../../prisma/generated/prisma";
import { removeUndefined } from "../../domain/helpers/remove-undefined";
import { StudentMapper } from "../mappers/student-mapper";

export class PrismaStudentRepository implements StudentRepository {
    constructor (private prisma: PrismaClient){}

    async create(student: Student): Promise<void> {
        const prismaStudent = StudentMapper.toPrisma(student)
        await this.prisma.student.create({data: prismaStudent})
    }

    async findById(studentId: UniqueEntityID): Promise<Student | null> {
        const student = await this.prisma.student.findUnique({
            where: {
                id: studentId.toString()
            }
        })
        if(!student){
            return null
        }

        return StudentMapper.toDomain(student)

    }

    async findByEmail(email: string): Promise<Student | null> {
        const student = await this.prisma.student.findUnique({
            where: {
                email: email
            }
        })
        if(!student){
            return null
        }

        return StudentMapper.toDomain(student)
    }

    async update(props : Partial<StudentProps>, id: UniqueEntityID): Promise<Student | null> {
        const newProps = removeUndefined(props)
        const response = await this.prisma.student.update({data: newProps, where : {
            id: id.toString()
        }})
        if(!response){
            return null
        }
        return StudentMapper.toDomain(response)

    }

}