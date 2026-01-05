import Fastify from "fastify";
import swagger from "./plugins/swagger";
import drizzle from "./plugins/drizzle";
import statics from "./plugins/statics";
import ejs from "./plugins/ejs";
import jwt from "./plugins/jwt";
import appRoutes from "./modules/approutes.route";
import services from "./modules/extensions/services";

export const buildApp = async () => {
    const app = Fastify({
        logger: process.env.NODE_ENV === 'production' ? true : {
            level: 'info',
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    colorize: true
                }
            }
        },
        trustProxy: true, // If behind nginx/load balancer
        requestIdLogLabel: 'reqId',
        disableRequestLogging: process.env.NODE_ENV === 'production',
        // Performance optimizations
        ignoreTrailingSlash: true,
        caseSensitive: false,
        connectionTimeout: 10000,
        keepAliveTimeout: 5000,
        bodyLimit: 1048576, // 1MB
    });

    await app.register(swagger);
    await app.register(drizzle);
    await app.register(statics);
    await app.register(ejs);
    await app.register(jwt);

    await app.register(services);

    app.get("/", (req, reply) => reply.view("index.ejs", { title: "Fastify Starter" }));

    appRoutes(app);

    //#region Health check endpoint
    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
    //#endregion

    return app;
};
