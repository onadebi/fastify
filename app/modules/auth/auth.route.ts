import { AuthService } from "./auth.service";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { FastifyInstance } from "fastify/types/instance";
import { LoginInput, RegisterInput } from "./dto/authLogin.dto";

export default async function routes(app: FastifyInstance) {
    const _authService = new AuthService();

    app.post<{
        Body: RegisterInput
    }>("/register", { schema: RegisterSchema }, async (req, reply) => {
        return await _authService.register(req.body);
    });

    app.post<{
        Body: LoginInput
    }>("/login",{schema: LoginSchema}, async (req, reply) => {
        const token = await _authService.login(app.jwt, req.body);
        if (!token) return reply.status(400).send({ error: "Invalid credentials" });
        return { token };
    });

    app.get("/me", { preHandler: [app.authenticate] }, async (req) => {
        return req.user;
    });
}
