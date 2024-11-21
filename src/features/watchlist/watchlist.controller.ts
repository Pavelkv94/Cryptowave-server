import { NextFunction, Request, Response } from "express";
import { AdditionalQueryInputModel } from "../auth/models/auth.models";
import { ApiError } from "../../exeptions/api-error";
import { watchlistService } from "./watchlist.service";
import { WatchCoinInputModel, WatchCoinViewModel } from "./models/watchlist.model";

export const watchlistController = {
  async getWatchlist(req: Request<{}, {}, {}, AdditionalQueryInputModel>, res: Response<WatchCoinViewModel[]>, next: NextFunction) {
    try {
      const watchlist = await watchlistService.getWatchlist(req.user.id);

      res.status(200).json(watchlist);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async addWatchItem(req: Request<{}, {}, WatchCoinInputModel, AdditionalQueryInputModel>, res: Response<WatchCoinViewModel>, next: NextFunction) {
    try {
      const newTransaction = await watchlistService.addWatchItem(req.body, req.user.id);
      res.status(201).json(newTransaction);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async deleteWatchItem(req: Request<{ watch_id: string }>, res: Response, next: NextFunction) {
    try {
      const isDeleted = await watchlistService.deleteWatchItem(req.params.watch_id);

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
