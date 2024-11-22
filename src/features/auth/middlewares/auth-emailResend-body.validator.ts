import { body } from "express-validator";
import { ValidationMiddleware } from "../../../common/middlewares/validation.middleware";
import { usersService } from "../../users/users.service";

const userEmailInputValidator = body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email) => {
        const user = await usersService.findUserByEmail(email);

        if (!user) {
            throw new Error("User not exist");
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new Error("Email is already confirmed");
        }
        return true;
    });

export const authEmailResendBodyValidators = [userEmailInputValidator, ValidationMiddleware];
