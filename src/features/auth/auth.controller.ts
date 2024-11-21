import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../common/types/types";
import { ApiError } from "../../exeptions/api-error";
import { nodemailerService } from "../../adapters/mail.service";
import { usersService } from "../users/users.service";
import { UserInputModel, UserViewModel } from "../users/models/users.models";
import { AdditionalQueryInputModel, ConfirmationInputModel, EmailResendInputModel, LoginInputModel, LoginOutputModel } from "./models/auth.models";
import { authService } from "./auth.service";
import { jwtService } from "../../adapters/jwt/jwt.service";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel, AdditionalQueryInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await authService.login(req.user.id);

      res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });
      res.status(HTTP_STATUSES.SUCCESS).send({ accessToken });
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async refresh(req: Request, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await authService.refresh(req.user.id);

      res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });
      res.status(HTTP_STATUSES.SUCCESS).send({ accessToken });
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async me(req: Request, res: Response<UserViewModel>, next: NextFunction) {
    const user = await usersService.findUser(req.user.id);

    if (!user) {
      return next(ApiError.NotFound("The requested user was not found"));
    }

    res.status(HTTP_STATUSES.SUCCESS).send(user);
  },
  async registration(req: Request<{}, {}, UserInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await usersService.create(req.body);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found"));
      }
      if (user) {
        nodemailerService.sendLetter(req.body.email, user.emailConfirmation.confirmationCode).catch((e) => console.log(e));
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async registrationConfirmation(req: Request<{}, {}, ConfirmationInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await usersService.findUserByCode(req.body.code);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found or code invalid"));
      }

      await authService.setConfirmEmailStatus(user.id, true);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
    async registrationEmailResending(req: Request<{}, {}, EmailResendInputModel>, res: Response, next: NextFunction) {
      try {
        const user = await usersService.findUserByEmail(req.body.email);
        if (!user) {
          return next(ApiError.NotFound("The requested user was not found or email invalid"));
        }

        const newConfirmationCode = await authService.setNewConfirmCode(user.id);

        nodemailerService.sendLetter(req.body.email, newConfirmationCode).catch((e) => console.log(e)); //долгий запрос с await

        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      } catch (error) {
        return next(ApiError.UnexpectedError(error as Error));
      }
    },
  async logout(req: Request<{}, {}, LoginInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      await jwtService.addTokenToBlackList(token);
      res.clearCookie("refreshToken");
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  //   async passwordRecovery(req: Request<{}, {}, EmailResendInputModel>, res: Response, next: NextFunction) {
  //     try {
  //       const user = await usersQueryRepository.findUserByEmail(req.body.email);

  //       if (!user) {
  //         res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  //         return;
  //       }

  //       const newConfirmationCode = await authService.setNewRecoveryCode(user.id);

  //       nodemailerService.sendLetter(req.body.email, newConfirmationCode, "recoveryPass").catch((e) => console.log(e)); //долгий запрос с await

  //       res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  //     } catch (error) {
  //       return next(ApiError.UnexpectedError(error as Error));
  //     }
  //   },
  //   async newPassword(req: Request<{}, {}, RecoveryPasswordInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
  //     try {
  //       const user = await usersQueryRepository.findUserByRecoveryCode(req.body.recoveryCode);

  //       if (!user) {
  //         return next(ApiError.NotFound("The requested user was not found or code invalid"));
  //       }

  //       const isUpdated = await usersService.updateUserPass(user.id, req.body.newPassword);

  //       if (!isUpdated) {
  //         throw new Error("Update User password Failed");
  //       }
  //       res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  //     } catch (error) {
  //       return next(ApiError.UnexpectedError(error as Error));
  //     }
  //   },
};
