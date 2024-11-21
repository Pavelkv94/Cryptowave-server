import { UserModel } from "../../db/models/User.model";
import { WatchCoinModel } from "../../db/models/WatchCoin.model";
import { WatchCoinViewDto } from "./dto";
import { WatchCoinInputModel, WatchCoinViewModel } from "./models/watchlist.model";

export const watchlistService = {
  async getWatchlist(user_id: string): Promise<WatchCoinViewModel[]> {
    const result = await WatchCoinModel.find({ user_id });
    return WatchCoinViewDto.mapToViewArray(result);
  },
  async addWatchItem(payload: WatchCoinInputModel, user_id: string): Promise<WatchCoinViewModel> {
    const user = await UserModel.findOne({_id: user_id}).lean();

    const newWatchIrem = {
      symbol: payload.symbol,
      name: payload.name,
      iconUrl: payload.iconUrl,
      user_id: user_id,
      changing: payload.changing,
      tg_nickname: user?.tg_nickname
    };
    const result = await WatchCoinModel.create(newWatchIrem);

    return WatchCoinViewDto.mapToView(result);
  },
  async deleteWatchItem(watch_id: string): Promise<boolean> {
    const result = await WatchCoinModel.deleteOne({ _id: watch_id });
    return result.deletedCount > 0;
  },
};
