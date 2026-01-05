import { LoginSchema, RegisterSchema } from "./auth.schema";
import { FastifyInstance } from "fastify/types/instance";
import { LoginInput, RegisterInput } from "./dto/authLogin.dto";

export default async function routes(app: FastifyInstance) {

    app.post<{
        Body: RegisterInput
    }>("/register", { schema:RegisterSchema }, async (req, reply) => {
        const objResp = await app.services.auth.register(req.body);
        reply.status(objResp.statusCode).send(objResp);
    });

    app.post<{
        Body: LoginInput
    }>("/login",{schema: LoginSchema}, async (req, reply) => {
        const token = await app.services.auth.login(app.jwt, req.body);
        if (!token) return reply.status(400).send({ error: "Invalid credentials" });
        return { token };
    });

    app.get("/me", { preHandler: [app.authenticate] }, async (req) => {
        return req.user;
    });
}
