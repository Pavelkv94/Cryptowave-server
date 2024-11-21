import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../common/types/types";
import { ApiError } from "../../exeptions/api-error";
import { externalService } from "./external.service";
import { CoinsViewType, CoinType, HistoryViewModel } from "./models/Coin.model";
import { ExchangeModel } from "./models/Exchange.model";
import { NewsViewModel } from "./models/News.model";

export const externalController = {
  async getExchanges(req: Request, res: Response<ExchangeModel[]>, next: NextFunction) {
    try {
      const data = await externalService.getExchanges();

      res.status(HTTP_STATUSES.SUCCESS).json(data);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async getCoins(req: Request<{}, {}, { count: string }>, res: Response<CoinsViewType>, next: NextFunction) {
    try {
      const data = await externalService.getCoins(req.query.count as string);
      res.status(HTTP_STATUSES.SUCCESS).json(data);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async getCoinById(req: Request<{ coin_id: string }>, res: Response<CoinType>, next: NextFunction) {
    try {
      const data = await externalService.getCoin(req.params.coin_id);
      res.status(HTTP_STATUSES.SUCCESS).json(data);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async getCoinHistory(req: Request<{ coin_id: string }, {}, { timePeriod: string }>, res: Response<HistoryViewModel>, next: NextFunction) {
    try {
      const data = await externalService.getCoinHistory(req.params.coin_id, req.query.timePeriod as string);
      res.status(HTTP_STATUSES.SUCCESS).json(data);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async getNews(req: Request<{}, {}, { newsCategory: string }>, res: Response<NewsViewModel>, next: NextFunction) {
    try {
      const data = await externalService.getNews(req.query.newsCategory as string);
      res.status(HTTP_STATUSES.SUCCESS).json(data);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
