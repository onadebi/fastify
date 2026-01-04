import { userprofile } from "../../db/schema/auth/auth.model";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { eq } from "drizzle-orm";
import { LoginInput, RegisterInput } from "./dto/authLogin.dto";
import type { JWT } from "@fastify/jwt";
import { dbConn } from "../../db/dbConfig";


export class AuthService {
    private readonly db = dbConn;

    async register({ email, password }: RegisterInput) {
        //TODO: Later:: check if user exists
        const hashed = await hashPassword(password);
        await this.db.insert(userprofile).values({ email, password: hashed });
        return { message: "User created" };
    }

    login = async (jwt: JWT, { email, password }: LoginInput) => {
        // const user = await this.db.select().from(userprofile).where(eq(userprofile.email, email)).limit(1);
        const user = await this.db.query.userprofile.findFirst({
            where: eq(userprofile.email, email.toLowerCase())
        }) //.select().from(userprofile).where(eq(userprofile.email, email)).limit(1);
        if (!user) return null;

        const valid = await verifyPassword(password, user.password);
        if (!valid) { return null }
        else {
            return jwt.sign({ id: user.id, email });
        }
    }
}
