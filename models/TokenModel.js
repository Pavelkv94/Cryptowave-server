const { Schema, model } = require("mongoose");

const TokenModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" }, //ссылка на айдишник и модель юзера
  refreshToken: { type: String, required: true },
});

module.exports = model("Token", TokenModel);
