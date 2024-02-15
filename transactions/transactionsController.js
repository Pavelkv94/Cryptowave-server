const User = require("../models/User");
const { validationResult } = require("express-validator"); //для получения сообщений об ошибках
const Transactions = require("../models/Transactions");

class transactionsController {
  async createTransaction(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка при регистрации", errors });
      }

      const { user, total, coin, note, operation, price_per_coin, quantity, date, tg_nickname } = req.body;
      const operationType = req.body.operation;
      const adjustedTotal = operationType === "sell" ? -total : total;

      // Update user's balance using Mongoose query
      const updatedUser = await User.findByIdAndUpdate({ _id: user }, { $inc: { balance: +adjustedTotal } }, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Update success");

      const newTransaction = new Transactions({
        coin: coin,
        quantity: quantity,
        price_per_coin: price_per_coin,
        note: note,
        total: total,
        operation: operation,
        user: user,
        date: date,
        tg_nickname: tg_nickname
      });

      const savedTransaction = await newTransaction.save();

      res.json(savedTransaction);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Registration Error" });
    }
  }

  async getTransactions(req, res) {
    const result = await Transactions.find({user: req.params.user_id})
    
    if (!result) {
      return res.status(404).json({ error: "History not found" });
    } else {
      res.json(result)
    }
  }

  async deleteTransaction(req, res) {
    const result = await Transactions.deleteOne({_id: req.params.transaction_id})
    if (!result) {
      return res.status(404).json({ error: "History not found" });
    } else {
      console.log("delete success!")
      res.json(result)
    }
  }
}

module.exports = new transactionsController();
