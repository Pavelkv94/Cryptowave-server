import { body } from "express-validator";
import { usersService } from "../../users/users.service";
import { hasDateExpired } from "../../../utils/hasDateExpired";
import { ValidationMiddleware } from "../../../common/middlewares/validation.middleware";

const code = body("code").custom(async (code) => {
  const user = await usersService.findUserByCode(code);

  if (!user) {
    throw new Error("The requested user was not found or code invalid");
  }

  if (user.emailConfirmation.isConfirmed) {
    throw new Error("Email is already confirmed");
  }

  if (hasDateExpired(user.emailConfirmation.expirationDate)) {
    throw new Error("Your activation link is expired. Resend activation email.");
  }
  return true;
});

export const authConfirmBodyValidators = [code, ValidationMiddleware];
