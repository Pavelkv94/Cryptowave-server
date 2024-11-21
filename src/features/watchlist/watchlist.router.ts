import { Router } from "express";
import { watchlistController } from "./watchlist.controller";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";

export const watchlistRouter = Router();

watchlistRouter.get("/", authAccessTokenMiddleware, watchlistController.getWatchlist);
watchlistRouter.post("/", authAccessTokenMiddleware, watchlistController.addWatchItem);
watchlistRouter.delete("/:watch_id", authAccessTokenMiddleware, watchlistController.deleteWatchItem);
