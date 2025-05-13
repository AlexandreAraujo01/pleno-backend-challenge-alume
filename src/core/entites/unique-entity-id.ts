import { randomUUID } from 'node:crypto';

export class UniqueEntityID {
  value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }

  toString() {
    return this.value.toString();
  }

  equals(value: UniqueEntityID): boolean {
    return this.value === value.toString();
  }
}
