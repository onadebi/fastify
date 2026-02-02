import { LoginSchema, RegisterSchema } from "./auth.schema";
import { FastifyInstance } from "fastify/types/instance";
import { LoginInput, RegisterInput } from "./dto/authLogin.dto";
import UserModelCreateDto from "./dto/userModelCreateDto";
import UserLoginDto from "./dto/userLoginDto";

export default async function routes(app: FastifyInstance) {

    app.post<{
        Body: UserModelCreateDto
    }>("/register", { schema:RegisterSchema }, async (req, reply) => {
        const objResp = await app.services.auth.register(req.body);
        reply.status(objResp.statusCode).send(objResp);
    });

    app.post<{
        Body: UserLoginDto
    }>("/login",{schema: LoginSchema}, async (req, reply) => {
        const token = await app.services.auth.login(req.body);
        if (!token) return reply.status(400).send({ error: "Invalid credentials" });
        return { token };
    });

    app.get("/me", { schema: { tags: ["Auth"] }, preHandler: [app.authenticate] }, async (req) => {
        return req.user;
    });
}
