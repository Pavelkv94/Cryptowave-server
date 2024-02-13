const { Schema, model } = require("mongoose");

const User = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true },
    avatar_url: { type: String, required: false },
});

module.exports = model("User", User);