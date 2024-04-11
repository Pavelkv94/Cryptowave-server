const Transactions = require("../models/Transactions");
const User = require("../models/UserModel");

class TransactionService {
  async createTransaction(user_id, total, coin, note, operation, price_per_coin, quantity, date, tg_nickname) {
    const adjustedTotal = operation === "sell" ? -total : total;

    const updatedUser = await User.findByIdAndUpdate({ _id: user_id }, { $inc: { balance: +adjustedTotal } }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newTransaction = {
      coin,
      quantity,
      price_per_coin,
      note,
      total,
      operation,
      user_id,
      date,
      tg_nickname,
    };

    const savedTransaction = await Transactions.create(newTransaction);

    return savedTransaction;
  }
}

module.exports = new TransactionService();
