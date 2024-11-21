type StatsType = {
  total: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: string;
  total24hVolume: string;
};

export type CoinType = {
  uuid: string;
  symbol: string;
  name: string;
  color: string;
  iconUrl: string;
  marketCap: string;
  price: string;
  listedAt: number;
  tier: number;
  change: string;
  rank: number;
  sparkline: string[];
  lowVolume: false;
  coinrankingUrl: string;
  "24hVolume": string;
  btcPrice: string;
  contractAddresses: string[];
  allTimeHigh?: {
    price: string;
  };
  numberOfMarkets?: string;
  numberOfExchanges?: string;
  supply?: {
    circulating: string;
    confirmed: boolean;
    max: string;
    supplyAt: number;
    total: string;
  };
  description?: string;
  links?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
};

export type CoinsViewType = {
  stats: StatsType;
  coins: CoinType[];
};

type HistoryModel = {
  price: string;
  timestamp: string;
};
export type HistoryViewModel = {
  change: string;
  history: HistoryModel[];
};
