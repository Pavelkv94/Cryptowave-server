import jwt from "jsonwebtoken";
import { JwtTokensType } from "../../features/auth/models/auth.models";
import { BlackTokenViewModel, JWTPayloadModel } from "./models/jwt.models";
import { BlackTokenModel } from "../../db/models/BlackToken.model";

export const jwtService = {
  async generateTokens(user_id: string): Promise<JwtTokensType> {
    const accessToken = jwt.sign({ user_id }, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ user_id }, `${process.env.JWT_REFRESH_SECRET}`, { expiresIn: "60m" });
    return {
      accessToken,
      refreshToken,
    };
  },
  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },
  async verifyAccessToken(token: string): Promise<{ user_id: string; deviceId: string } | null> {
    try {
      return jwt.verify(token, `${process.env.JWT_ACCESS_SECRET}`) as { user_id: string; deviceId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
  async verifyRefreshToken(token: string): Promise<JWTPayloadModel | null> {
    try {
      return jwt.verify(token, `${process.env.JWT_REFRESH_SECRET}`) as JWTPayloadModel;
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
  async addTokenToBlackList(token: string): Promise<BlackTokenViewModel> {
    const { user_id } = await this.decodeToken(token);

    const invalidToken = await BlackTokenModel.create({ user: user_id, token });

    return invalidToken;
  },
  async findTokenInBlackList(token: string): Promise<BlackTokenViewModel | null> {
    const invalidTokenId = await BlackTokenModel.findOne({ token });

    return invalidTokenId;
  },
};
