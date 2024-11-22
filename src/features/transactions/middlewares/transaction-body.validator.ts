import { body } from "express-validator";
import { ValidationMiddleware } from "../../../common/middlewares/validation.middleware";

const coinInputValidator = body("coin").isString().withMessage("not string");

const quantityInputValidator = body("quantity").isString().withMessage("not string");

const price_per_coinInputValidator = body("price_per_coin").isString().withMessage("not string");

const noteInputValidator = body("note").isString().withMessage("not string").trim().isLength({ min: 0, max: 120 }).withMessage("should be  to 120 symbols");

const totalInputValidator = body("total").isString().withMessage("not string");

const operationValidator = body("operation")
  .isString()
  .withMessage("not string")
  .custom(async (operation) => {
    const isValid = operation === "buy" || operation === "sell";

    if (!isValid) {
      throw new Error("operation must be unique");
    }
    return true;
  });

export const transactionBodyValidators = [
  coinInputValidator,
  quantityInputValidator,
  price_per_coinInputValidator,
  noteInputValidator,
  totalInputValidator,
  operationValidator,
  ValidationMiddleware,
];
