import { HydratedDocument } from "mongoose";

export type TransactionEntityModel = {
  coin: string;
  quantity: string;
  price_per_coin: string;
  note: string;
  total: string;
  operation: string;
  user_id: string;
  date: string;
  tg_nickname: string;
};

export type TransactionViewModel = Omit<TransactionEntityModel, "tg_nickname"> & { id: string };
export type TransactionInputModel = {
  //   user_id: string;
  coin: string;
  quantity: string;
  price_per_coin: string;
  note: string;
  total: string;
  operation: string;
  date: string;
  //   tg_nickname: string;
};

export type TransactionDocument = HydratedDocument<TransactionEntityModel>;
