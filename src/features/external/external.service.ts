import { buildPriorDate } from "../../utils/buildPriorDate";
import { getCoins } from "../../bot/helpers/getCoins.api";
import { CoinsViewType, CoinType, HistoryViewModel } from "./models/Coin.model";
import { ExchangeModel } from "./models/Exchange.model";
import { NewsViewModel } from "./models/News.model";

export const externalService = {
  async getCoins(count: string): Promise<CoinsViewType> {
    const result = await getCoins(`/coins?limit=${count}`);
    return result;
  },
  async getCoin(coin_id: string): Promise<CoinType> {
    const result = await getCoins(`/coin/${coin_id}`);
    return result;
  },
  async getCoinHistory(coin_id: string, timePeriod: string): Promise<HistoryViewModel> {
    const result = await getCoins(`/coin/${coin_id}/history?timePeriod=${timePeriod}`);
    return result;
  },
  async getExchanges(): Promise<ExchangeModel[]> {
    const apiKey = process.env.EXTERNAL_EXCHANGES_APIKEY;

    if (!apiKey) {
      throw new Error("API key is missing");
    }

    const url = "https://api.coingecko.com/api/v3/exchanges";
    const options = {
      method: "GET",
      headers: { accept: "application/json", "x-cg-demo-api-key": apiKey },
    };

    // const url = 'https://coinranking1.p.rapidapi.com/exchange/-zdvbieRdZ';
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'x-rapidapi-key': process.env.EXTERNAL_EXCHANGES_APIKEY,
    //     'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
    //     referenceCurrencyUuid: 'yhjMzLPhuIDl'
    //   }
    // };

    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  },
  async getNews(newsCategory: string): Promise<NewsViewModel> {
    const apiKey = process.env.EXTERNAL_NEWSAPI_KEY;

    if (!apiKey) {
      throw new Error("API key is missing");
    }

    const url = `https://newsapi.org/v2/everything?q=${newsCategory}&from=${buildPriorDate()}&sortBy=publishedAt&apiKey=${apiKey}&language=en`;

    const response = await fetch(url);
    const result = await response.json();
    return result;
  },
};
