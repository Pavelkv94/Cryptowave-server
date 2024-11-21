import { HydratedDocument } from "mongoose";

export type EmailConfirmationEntityType = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};

export type UserEntityModel = {
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationEntityType;
  balance: number;
  avatar_url: string;
  tg_nickname: string;
  chat_id: string;
};

export type UserDocument = HydratedDocument<UserEntityModel>;

export type UserViewModel = {
  id: string;
  email: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationEntityType;
  balance: number;
  avatar_url: string;
  tg_nickname: string;
  chat_id: string;
};

export type UserInputModel = {
  email: string;
  password: string;
  tg_nickname: string;
};

export type AvatarInputModel = {
  avatar_url: string;
};


export type URIParamsUserModel = {
  id: string;
};
