
import {hash, compare} from 'bcrypt'

export class BcryptAuthService {
  async hashPassword(password: string) {
    return hash(password, 10);
  }

  async comparePasswords(raw: string, hash: string) {
    return compare(raw, hash);
  }
}