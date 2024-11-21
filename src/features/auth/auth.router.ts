import { Router } from "express";
import { rateLimiterMiddleware } from "./middlewares/auth-rateLimiter.middleware";
import { userBodyValidators } from "../users/middlewares/user-body.validator";
import { authController } from "./auth.controller";
import { authConfirmBodyValidators } from "./middlewares/auth-confirmation-body.validator";
import { authLoginBodyValidators } from "./middlewares/auth-login-body.validator";
import { authLoginMiddleware } from "./middlewares/auth-login.middleware";
import { authRefreshTokenMiddleware } from "./middlewares/auth-refreshToken.middleware";
import { authAccessTokenMiddleware } from "./middlewares/auth-accessToken.middleware";
import { authEmailResendBodyValidators } from "./middlewares/auth-emailResend-body.validator";

export const authRouter = Router();

authRouter.post("/registration", userBodyValidators, rateLimiterMiddleware, authController.registration);
authRouter.post("/registration-confirmation", rateLimiterMiddleware, authConfirmBodyValidators, authController.registrationConfirmation);
authRouter.post("/login", rateLimiterMiddleware, authLoginBodyValidators, authLoginMiddleware, authController.login);
authRouter.post("/refresh", authRefreshTokenMiddleware, authController.refresh);
authRouter.get("/me", authAccessTokenMiddleware, authController.me);
authRouter.post("/logout", authRefreshTokenMiddleware, authController.logout);
authRouter.post("/registration-email-resending", rateLimiterMiddleware, authEmailResendBodyValidators, authController.registrationEmailResending);

