import { NextFunction, Request, Response } from "express";
import { transactionsService } from "./transactions.service";
import { TransactionInputModel, TransactionViewModel } from "./models/transactions.model";
import { AdditionalQueryInputModel } from "../auth/models/auth.models";
import { ApiError } from "../../exeptions/api-error";

export const transactionsController = {
  async getTransactions(req: Request<{}, {}, {}, AdditionalQueryInputModel>, res: Response<TransactionViewModel[]>, next: NextFunction) {
    try {
      const transactions = await transactionsService.getTransactions(req.user.id);

      res.status(200).json(transactions);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async createTransaction(req: Request<{}, {}, TransactionInputModel>, res: Response<TransactionViewModel>, next: NextFunction) {
    try {
      const newTransaction = await transactionsService.createTransaction(req.body, req.user.id);
      res.status(201).json(newTransaction);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async deleteTransaction(req: Request<{ transaction_id: string }>, res: Response, next: NextFunction) {
    try {
      const isDeleted = await transactionsService.deleteTransaction(req.params.transaction_id);

      if (!isDeleted) {
        next(ApiError.NotFound("Transaction not found."));
        return;
      }
      res.sendStatus(204);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
