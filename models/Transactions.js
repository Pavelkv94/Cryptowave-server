const { Schema, model } = require("mongoose");

const Transactions = new Schema({
    coin: { type: String, required: true },
    quantity: { type: String, required: true },
    price_per_coin: { type: String, required: true },
    note: { type: String, required: false },
    total: { type: String, required: true },
    operation: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: String, required: true },
});

module.exports = model("Transactions", Transactions);