const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  balance: { type: Number, required: true },
  avatar_url: { type: String, required: false },
  tg_nickname: { type: String, unique: true, required: true },
  chat_id: { type: String, required: false },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});


module.exports = model("User", UserSchema);