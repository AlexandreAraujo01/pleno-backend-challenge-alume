import { Prisma, Student  as PrismaStudent } from "../../prisma/generated/prisma";
import { Student } from "../../domain/entites/student";
import { UniqueEntityID } from "../../core/entites/unique-entity-id";

export class StudentMapper {
    
    static toPrisma(student:Student): Prisma.StudentUncheckedCreateInput {
        const prismaStudent = {
            id: student.id.toString(),
            name: student.name,
            lastName: student.lastName,
            email: student.email,
            password_hash: student.password,
            created_at: student.createdAt,
        }

        return prismaStudent
    }

    static toDomain(prismaStudent: PrismaStudent): Student {
        return new Student({
            name: prismaStudent.name,
            email: prismaStudent.email,
            lastName: prismaStudent.lastName,
            password: prismaStudent.password_hash,
            createdAt: prismaStudent.created_at
        }, new UniqueEntityID(prismaStudent.id))
    }


}