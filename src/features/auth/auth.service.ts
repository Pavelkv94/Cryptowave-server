import { jwtService } from "../../adapters/jwt/jwt.service";
import { UserModel } from "../../db/models/User.model";
import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { usersService } from "../users/users.service";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/getExpirationDate";

export const authService = {
  async login(user_id: string): Promise<JwtTokensType> {
    const tokens = await jwtService.generateTokens(user_id);

    return tokens;
  },
  async refresh(user_id: string): Promise<JwtTokensType> {
    const tokens = await jwtService.generateTokens(user_id);

    return tokens;
  },
  async checkRefreshToken(token: string): Promise<{ user_id: string } | null> {
    const payload = await jwtService.verifyRefreshToken(token);

    if (!payload) {
      return null;
    }

    const user = await usersService.findUser(payload.user_id);

    if (!user) {
      return null;
    }

    const isInvalidToken = await jwtService.findTokenInBlackList(token);

    if (isInvalidToken) {
      return null;
    }

    return { user_id: payload.user_id };
  },
  async checkUserCredentials(payload: LoginInputModel): Promise<string | null> {
    const user = await UserModel.findOne({ email: payload.email }).lean();

    if (!user) {
      return null;
    }
    const isPasswordValid = await bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    return user._id.toString();
  },
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const result = await UserModel.updateOne({ _id: user_id }, { $set: { "emailConfirmation.isConfirmed": status } });

    return result.matchedCount > 0;
  },
  async setNewConfirmCode(user_id: string): Promise<string> {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);
    const result = await UserModel.updateOne(
      { _id: user_id },
      { $set: { "emailConfirmation.confirmationCode": newConfirmationCode, "emailConfirmation.expirationDate": newExpirationDate } }
    );
    const isUpdatedUserConfirmation = result.matchedCount > 0;

    if (!isUpdatedUserConfirmation) {
      throw new Error("Update User confirmation Failed");
    }
    return newConfirmationCode;
  },
};
