import { Router } from "express";
import { transactionsController } from "./transactions.controller";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { transactionBodyValidators } from "./middlewares/transaction-body.validator";

export const transactionsRouter = Router();

transactionsRouter.get("/history", authAccessTokenMiddleware, transactionsController.getTransactions);
transactionsRouter.post("/", transactionBodyValidators, authAccessTokenMiddleware, transactionsController.createTransaction);
transactionsRouter.delete("/:transaction_id", authAccessTokenMiddleware, transactionsController.deleteTransaction);
