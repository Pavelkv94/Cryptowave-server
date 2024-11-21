import { body } from "express-validator";
import { UserModel } from "../../../db/models/User.model";
import { ValidationMiddleware } from "../../../common/middlewares/validation.middleware";

type UniqueField = {
  email?: string;
  tg_nickname?: string;
};

export const isUserUniqueField = async (field: UniqueField) => {
  const existingUser = await UserModel.findOne(field);
  return !existingUser;
};

const userPasswordInputValidator = body("password")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("should be from 6 to 20 symbols");

const tgNicknameInputValidator = body("tg_nickname")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 5, max: 32 })
  .withMessage("should be from 5 to 32 symbols")
  .custom(async (tg_nickname) => {
    const isUnique = await isUserUniqueField({ tg_nickname });
    if (!isUnique) {
      throw new Error("tg_nickname must be unique");
    }
    return true;
  });

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const isUnique = await isUserUniqueField({ email });
    if (!isUnique) {
      throw new Error("Email must be unique");
    }
    return true;
  });

export const userBodyValidators = [userPasswordInputValidator, tgNicknameInputValidator, userEmailInputValidator, ValidationMiddleware];
