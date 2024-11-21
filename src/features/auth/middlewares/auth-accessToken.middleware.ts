import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../../adapters/jwt/jwt.service";
import { ApiError } from "../../../exeptions/api-error";
import { usersService } from "../../users/users.service";

export const authAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const payload = await jwtService.verifyAccessToken(token);

  if (!payload) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const user = await usersService.findUser(payload.user_id);

  if (!user) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  req.user = { id: payload.user_id };

  next();
};
