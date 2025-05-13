import { boolean } from "zod";
import { AuthService } from "../../core/services/auth-service";

export class FakeAuthService extends AuthService {
    async hashPassword(password: string): Promise<string> {
        return `${password}-hashed`
    }

    async comparePasswords(raw: string, hash: string): Promise<boolean> {
        const passwordHashed = `${raw}-hashed`

        if(passwordHashed === `${hash}-hashed`){
            return true
        }
        return false
    }

}