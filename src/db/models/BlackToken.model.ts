import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { BlackTokenViewModel } from "../../adapters/jwt/models/jwt.models";

const BlackTokenSchema = new Schema<WithId<BlackTokenViewModel>>({
  user: { type: Schema.Types.ObjectId, ref: "users" }, //ссылка на айдишник и модель юзера
  token: { type: String, require: true },
});

export const BlackTokenModel = model<WithId<BlackTokenViewModel>>("blackTokens", BlackTokenSchema);
