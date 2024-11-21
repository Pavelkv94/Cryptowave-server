import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../../exeptions/api-error";
import { FieldNamesType } from "../types/output-errors-types";

export const ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const e = validationResult(req);

  if (!e.isEmpty()) {
    const eArray = e.array({ onlyFirstError: true }) as { path: FieldNamesType; msg: string }[];

    return next(ApiError.ValidationError(eArray.map((x) => ({ field: x.path, message: x.msg }))));
  }

  next();
};
