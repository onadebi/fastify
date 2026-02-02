import { FastifyInstance } from "fastify";
import homeRoute from "./home/home.route";

export const PageRoutes = (app: FastifyInstance) => {
    app.register(homeRoute, { prefix: "/" });
}
