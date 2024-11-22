import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./features/auth/auth.router";
import { testingRouter } from "./features/testing/testing.router";
import { usersRouter } from "./features/users/users.router";
import { errorHandlerMiddleware } from "./common/middlewares/error-handler.middleware";
import { config } from "dotenv";
import { externalRouter } from "./features/external/external.router";
import { transactionsRouter } from "./features/transactions/transactions.router";
import { watchlistRouter } from "./features/watchlist/watchlist.router";

export const initApp = () => {
  config();

  const app = express();
  app.use(cookieParser());
  app.use(express.json());

  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
  );

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/delete", testingRouter);
  app.use("/external", externalRouter);
  app.use("/transactions", transactionsRouter);
  app.use("/watchlist", watchlistRouter);

  app.use(errorHandlerMiddleware);

  return app;
};
