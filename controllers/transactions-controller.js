const User = require("../models/UserModel");
const { validationResult } = require("express-validator");
const Transactions = require("../models/Transactions");
const transactionService = require("../service/transaction-service");

class transactionsController {
  async createTransaction(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Creation error", errors });
      }

      const { user_id, total, coin, note, operation, price_per_coin, quantity, date, tg_nickname } = req.body;

      const transactionData = await transactionService.createTransaction(user_id, total, coin, note, operation, price_per_coin, quantity, date, tg_nickname)

      res.json(transactionData);
    } catch (e) {
      next(e);
    }
  }

  async getTransactions(req, res) {
    const result = await Transactions.find({user_id: req.params.user_id})
    
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
      console.log("Delete success!")
      res.json(result)
    }
  }
}

module.exports = new transactionsController();
