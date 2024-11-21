import { CoinsViewType, CoinType, HistoryViewModel } from "../../features/external/models/Coin.model";

export const getCoins = async (url: string): Promise<CoinsViewType & CoinType & HistoryViewModel> => {
  const apiKey = process.env.EXTERNAL_COINDESK_APIKEY;

  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const config = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      "ngrok-skip-browser-warning": "true",
    },
  };

  const baseUrl = "https://coinranking1.p.rapidapi.com";

  const response = await fetch(`${baseUrl}${url}`, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: { status: string; data: CoinsViewType & CoinType & HistoryViewModel } = await response.json();
  return data.data;
};
