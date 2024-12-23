import { Response, Request, NextFunction } from "express";
import { ApiError } from "../../exeptions/api-error";
import { fromBase64ToUTF8 } from "../../utils/base64";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"] as string;

  if (!auth) {
    return next(ApiError.Unauthorized());
  }
  if (auth.slice(0, 6) !== "Basic ") {
    return next(ApiError.Unauthorized());
  }

  const decodedAuth = fromBase64ToUTF8(auth.slice(6));

  if (decodedAuth !== process.env.ADMIN) {
    return next(ApiError.Unauthorized());
  }

  next();
};
