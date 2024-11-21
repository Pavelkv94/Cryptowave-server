import { body } from "express-validator";
import { ValidationMiddleware } from "../../../common/middlewares/validation.middleware";

const loginOrEmail = body("email").notEmpty().withMessage("Email is required").isString().withMessage("not string");
const password = body("password").notEmpty().withMessage("password is required").isString().withMessage("not string");

export const authLoginBodyValidators = [loginOrEmail, password, ValidationMiddleware];
