import { FastifyInstance } from "fastify";
import authRoutes from "./auth/auth.route";

const AppRoutes = (app: FastifyInstance) => {

    app.register(authRoutes, { prefix: "/api/auth" });
}

export default AppRoutes;