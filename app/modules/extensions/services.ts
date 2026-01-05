import fp from "fastify-plugin";
import { AuthRepository } from "../auth/auth.repository";
import { AuthService } from "../auth/auth.service";

export default fp(async (app) => {
    const authRepo = new AuthRepository();
    const authService = new AuthService(authRepo);
    app.decorate("services", {
        auth: authService
    });

    //   const transactionRepo = new TransactionRepository();
    //   const transactionService = new TransactionService(transactionRepo);
    //   app.decorate("transactionService", transactionService);
});

declare module "fastify" {
  interface FastifyInstance {
    services: {
      auth: AuthService;
    //   transaction: TransactionService;
    };
  }
}