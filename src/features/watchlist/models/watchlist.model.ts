import { HydratedDocument } from "mongoose";

export type WatchCoinEntityModel = {
  symbol: string;
  name: string;
  iconUrl: string;
  tg_nickname: string;
  user_id: string;
  changing: string;
};

export type WatchCoinDocument = HydratedDocument<WatchCoinEntityModel>;

export type WatchCoinViewModel = {
  symbol: string;
  name: string;
  iconUrl: string;
  changing: string;
  id: string;
};

export type WatchCoinInputModel = {
  symbol: string;
  name: string;
  iconUrl: string;
  changing: string;
};
