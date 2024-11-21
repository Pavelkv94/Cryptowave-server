import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { authService } from "../auth.service";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const payload = await authService.checkRefreshToken(token);

  if (!payload) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  req.user = { id: payload.user_id };

  next();
};
