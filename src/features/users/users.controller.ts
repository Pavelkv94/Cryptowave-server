import { NextFunction, Request, Response } from "express";
import { usersService } from "./users.service";
import { HTTP_STATUSES } from "../../common/types/types";
import { ApiError } from "../../exeptions/api-error";
import { AvatarInputModel, URIParamsUserModel, UserInputModel, UserViewModel } from "./models/users.models";

export const usersController = {
    async getUsers(req: Request, res: Response<UserViewModel[]>, next: NextFunction) {
        try {
            const users = await usersService.getUsers();
            res.status(HTTP_STATUSES.SUCCESS).json(users);
        } catch (error) {
            return next(ApiError.UnexpectedError(error as Error));
        }
    },
    async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>, next: NextFunction) {
        try {
            const newUser = await usersService.create(req.body);

            res.status(201).json(newUser);
        } catch (error) {
            return next(ApiError.UnexpectedError(error as Error));
        }
    },
    async updateAvatar(req: Request<{}, {}, AvatarInputModel>, res: Response, next: NextFunction) {
        try {
            await usersService.updateAvatar(req.user.id, req.body.avatar_url);

            res.sendStatus(204);
        } catch (error) {
            return next(ApiError.UnexpectedError(error as Error));
        }
    },

    async deleteUser(req: Request<URIParamsUserModel>, res: Response, next: NextFunction) {
        try {
            const isDeletedUser = await usersService.deleteUser(req.params.id);

            if (!isDeletedUser) {
                return next(ApiError.NotFound("The requested user was not found"));
            } else {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT);
            }
        } catch (error) {
            return next(ApiError.UnexpectedError(error as Error));
        }
    },
};
