import { Router } from "express";
import { adminMiddleware } from "../../common/middlewares/admin.middleware";
import { usersController } from "./users.controller";
import { userBodyValidators } from "./middlewares/user-body.validator";
import { findUserMiddleware } from "./middlewares/findUser.middleware";
import { authRefreshTokenMiddleware } from "../auth/middlewares/auth-refreshToken.middleware";

export const usersRouter = Router();

usersRouter.get("/", adminMiddleware, usersController.getUsers);
usersRouter.post("/", adminMiddleware, userBodyValidators, usersController.createUser);
usersRouter.delete("/:id", adminMiddleware, findUserMiddleware, usersController.deleteUser);
usersRouter.post("/updateAvatar", authRefreshTokenMiddleware, usersController.updateAvatar);
