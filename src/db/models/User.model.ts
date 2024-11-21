import { UserEntityModel } from "../../features/users/models/users.models";
import { Schema, model } from "mongoose";

const UserSchema = new Schema<UserEntityModel>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, require: true },
  emailConfirmation: {
    confirmationCode: { type: String, require: true },
    expirationDate: { type: String, require: true },
    isConfirmed: { type: Boolean, require: true },
  },
  balance: { type: Number, required: true },
  avatar_url: { type: String, required: false },
  tg_nickname: { type: String, unique: true, required: true },
  chat_id: { type: String, required: false },
});

export const UserModel = model<UserEntityModel>("users", UserSchema);
