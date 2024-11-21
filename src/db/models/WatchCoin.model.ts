import { Schema, model } from "mongoose";
import { WatchCoinEntityModel } from "../../features/watchlist/models/watchlist.model";

const WatchCoinSchema = new Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  iconUrl: { type: String, required: true },
  tg_nickname: { type: String, required: true },
  user_id: { type: String, required: true },
  changing: { type: String, required: true },
});

export const WatchCoinModel = model<WatchCoinEntityModel>("WatchCoins", WatchCoinSchema);
