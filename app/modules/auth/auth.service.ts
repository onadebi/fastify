import { LoginInput, RegisterInput } from "./dto/authLogin.dto";
import type { JWT } from "@fastify/jwt";
import { AuthRepository } from "./auth.repository";
import UserModelCreateDto from "./dto/userModelCreateDto";
import UserLoginDto from "./dto/userLoginDto";


export class AuthService {
    constructor(private readonly _authRepo: AuthRepository) {}

    async register(userdetail: UserModelCreateDto) {
        return await this._authRepo.registerUser(userdetail);
    }

    login = async (userLoginDto: UserLoginDto) => {
        return await this._authRepo.login(userLoginDto);
    }
}
