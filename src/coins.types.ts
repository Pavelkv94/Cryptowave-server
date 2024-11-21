export interface Icoin {
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
}

export interface ICoinStats {
    total: number;
    totalCoins: number;
    totalMarkets: number;
    totalExchanges: number;
    totalMarketCap: string;
    total24hVolume: string;
}

export interface IHistory {
    price: string;
    timestamp: string;
}
export interface CoinHistoryDataType {
    change: string;
    history: IHistory[];
}

export interface IExchanges {
    id: string;
    name: string;
    year_established: number | null;
    country: string | null;
    description: string | null;
    url: string;
    image: string;
    has_trading_incentive: boolean | null;
    trust_score: number;
    trust_score_rank: number;
    trade_volume_24h_btc: number;
    trade_volume_24h_btc_normalized: number;
}

export interface INewsArticle {
    source: {
        id: null;
        name: string;
    };
    author: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
    title: string;
}

export interface IWatchItem {
    id: string;
    symbol: string;
    name: string;
    iconUrl: string;
    tg_nickname: string;
    user_id: string;
    changing: string;
}
