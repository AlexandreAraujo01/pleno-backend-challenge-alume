import { faker } from '@faker-js/faker';

import { Student, StudentProps } from "../../domain/entites/student";
import { UniqueEntityID } from '../../core/entites/unique-entity-id';
import { FakeAuthService } from '../services/fake-auth-service';

export async function studentFactory(studentProps : Partial<StudentProps>, id?: UniqueEntityID): Promise<Student>{
    const fakeAuthService = new FakeAuthService()
    return new Student({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        lastName: faker.person.lastName(),
        password: await fakeAuthService.hashPassword(faker.internet.password()),
        createdAt: new Date(),
        ...studentProps
    },
    id ? id : new UniqueEntityID()
)
}