import { Response, Request, NextFunction } from "express";
import { ApiError } from "../../exeptions/api-error";
import { fromBase64ToUTF8 } from "../../utils/base64";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"] as string;

  if (!auth) {
    console.log("===========ERROR PLACE # 1")
    return next(ApiError.Unauthorized());
  }
  if (auth.slice(0, 6) !== "Basic ") {
    console.log("===========ERROR PLACE # 2")

    return next(ApiError.Unauthorized());
  }

  const decodedAuth = fromBase64ToUTF8(auth.slice(6));

  if (decodedAuth !== process.env.ADMIN || "") {
    console.log("===========ERROR PLACE # 3")

    return next(ApiError.Unauthorized());
    
  }

  next();
};
