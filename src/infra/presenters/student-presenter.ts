import { Student } from "../../domain/entites/student";

interface studentPresenter {
    id: string,
    name: string,
    last_name: string,
    email: string
}

export function studentPresenter(student: Student): studentPresenter{
    return {
        id: student.id.toString(),
        name: student.name,
        last_name: student.lastName,
        email: student.email,
    }

}