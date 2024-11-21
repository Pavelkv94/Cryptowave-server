import { WatchCoinDocument, WatchCoinViewModel } from "./models/watchlist.model";

export class WatchCoinViewDto {
  symbol: string;
  name: string;
  iconUrl: string;
  changing: string;
  id: string;

  constructor(model: WatchCoinDocument) {
    this.symbol = model.symbol;
    this.name = model.name;
    this.iconUrl = model.iconUrl;
    this.changing = model.changing;
    this.id = model._id.toString();
  }

  static mapToView(coin: WatchCoinDocument): WatchCoinViewDto {
    return new WatchCoinViewDto(coin);
  }

  static mapToViewArray(transactions: WatchCoinDocument[]): WatchCoinViewModel[] {
    return transactions.map((transaction) => this.mapToView(transaction));
  }
}
