


export abstract class AuthService {

  abstract hashPassword(password: string): Promise<string>

  abstract comparePasswords(raw: string, hash: string): Promise<boolean>

}