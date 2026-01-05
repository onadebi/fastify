import { JWT } from "@fastify/jwt";
import { eq } from "drizzle-orm";
import { dbConn } from "../../db/dbConfig";
import { userprofile } from "../../db/schema/auth/auth.model";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { RegisterInput, LoginInput } from "./dto/authLogin.dto";
import GenResponse, { StatusCode } from "../../utils/GenResponse";

export class AuthRepository {

    private readonly db = dbConn;

    async register({ email, password }: RegisterInput) {
        //TODO: Later:: check if user exists
        const hashed = await hashPassword(password);
        const result = await this.db.insert(userprofile).values({ email, password: hashed })
            .returning();//{ id: userprofile.id, email: userprofile.email });
        if (!result || result.length === 0) {
            return GenResponse.Failed(null, StatusCode.Forbidden, false, "User creation failed");
        }
        return GenResponse.Success(result[0], StatusCode.Created,true,"User created succesfully");
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