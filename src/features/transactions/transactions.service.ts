import { TransactionModel } from "../../db/models/Transaction";
import { UserModel } from "../../db/models/User.model";
import { TransactionViewDto } from "./dto";
import { TransactionInputModel, TransactionViewModel } from "./models/transactions.model";

export const transactionsService = {
  async getTransactions(user_id: string) {
    const result = await TransactionModel.find({ user_id });

    return TransactionViewDto.mapToViewArray(result);
  },
  async createTransaction(payload: TransactionInputModel, user_id: string): Promise<TransactionViewModel> {
    const user = await UserModel.findOne({ _id: user_id }).lean();

    const newTransaction = {
      coin: payload.coin,
      quantity: payload.quantity,
      price_per_coin: payload.price_per_coin,
      note: payload.note,
      total: payload.total,
      operation: payload.operation,
      user_id: user_id,
      date: payload.date,
      tg_nickname: user?.tg_nickname,
    };
    const result = await TransactionModel.create(newTransaction);

    return TransactionViewDto.mapToView(result);
  },
  async deleteTransaction(transaction_id: string): Promise<boolean> {
    const result = await TransactionModel.deleteOne({ _id: transaction_id });
    return result.deletedCount > 0;
  },
};
