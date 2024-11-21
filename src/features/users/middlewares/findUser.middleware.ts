import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { usersService } from "../users.service";

export const findUserMiddleware = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isUserExist = usersService.findUser(req.params.id);

  if (!isUserExist) {
    return next(ApiError.NotFound("The requested user was not found"));
  }
  next();
};
