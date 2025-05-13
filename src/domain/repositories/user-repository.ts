import { UniqueEntityID } from "../../core/entites/unique-entity-id";
import { Student, StudentProps } from "../entites/student";

export abstract class StudentRepository {

    abstract create(student: Student): Promise<void>

    abstract findById(studentId: UniqueEntityID): Promise<Student | null>

    abstract findByEmail(email: string): Promise<Student | null>

    abstract update(props: Partial<StudentProps>, id: UniqueEntityID): Promise<Student | null>
}