import { Schema, model } from "mongoose";
import { TransactionEntityModel } from "../../features/transactions/models/transactions.model";

const TransactionSchema = new Schema({
  coin: { type: String, required: true },
  quantity: { type: String, required: true },
  price_per_coin: { type: String, required: true },
  note: { type: String, required: false },
  total: { type: String, required: true },
  operation: { type: String, required: true },
  user_id: { type: String, required: true },
  date: { type: String, required: true },
  tg_nickname: { type: String, required: true },
});
export const TransactionModel = model<TransactionEntityModel>("Transactions", TransactionSchema);
