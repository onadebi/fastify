import { LoginInput, RegisterInput } from "./dto/authLogin.dto";
import type { JWT } from "@fastify/jwt";
import { AuthRepository } from "./auth.repository";


export class AuthService {
    constructor(private readonly _authRepo: AuthRepository) {}

    async register({ email, password }: RegisterInput) {
        return await this._authRepo.register({ email, password });
    }

    login = async (jwt: JWT, { email, password }: LoginInput) => {
        return await this._authRepo.login(jwt, { email, password });
    }
}
