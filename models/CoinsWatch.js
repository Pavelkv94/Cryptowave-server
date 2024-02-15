const { Schema, model } = require("mongoose");

const CoinsWatch = new Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  iconUrl: { type: String, required: true },
  tg_nickname: { type: String, required: true },
  user: { type: String, required: true },
  changing: { type: String, required: true },

});

module.exports = model("CoinsWatch", CoinsWatch);
