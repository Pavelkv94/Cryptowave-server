import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../exeptions/api-error";

export const originMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = process.env.CLIENT_URL;
  if (req.headers.origin !== allowedOrigin) {
    next(ApiError.Forbidden());
  }
  next();
};
