import { Router } from "express";
import { externalController } from "./external.controller";

export const externalRouter = Router();

externalRouter.get("/news", externalController.getNews);
externalRouter.get("/exchanges", externalController.getExchanges);
externalRouter.get("/coins", externalController.getCoins);
externalRouter.get("/coin/:coin_id", externalController.getCoinById);
externalRouter.get("/coin/:coin_id/history", externalController.getCoinHistory);
externalRouter.get("/news", externalController.getNews);
