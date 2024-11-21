import { UserModel } from "../db/models/User.model";
import { WatchCoinModel } from "../db/models/WatchCoin.model";
import { getCoins } from "./helpers/getCoins.api";
import { bot } from "./runBot";

export const monitorPrice = async (): Promise<void> => {
    const watchList = await WatchCoinModel.find({});
    const users = await UserModel.find({});

    const currentDate = new Date().toISOString();
    console.log("auto monitor: ", currentDate);

    const usersWithWatchList = users.filter((user) => watchList.some((obj) => obj.tg_nickname === user.tg_nickname));

    if (!watchList) {
        throw new Error("Watch list not found");
    }

    const { coins } = await getCoins("/coins?limit=100");

    const upImage = "https://www.techopedia.com/wp-content/uploads/2023/11/stablecoins_and_trading_chart_01.jpg";
    const downImage = "https://www.shutterstock.com/image-photo/red-crashing-market-volatility-crypto-600nw-2155610545.jpg";

    usersWithWatchList.forEach((user) => {
        const userWatchList = watchList.filter((list) => list.tg_nickname === user.tg_nickname);

        userWatchList.forEach((userListItem) => {
            const coinData = coins.find((el) => el.name === userListItem.name);
            if (!coinData) {
                throw new Error("Coin not found");
            }
            if (parseFloat(coinData.change) >= parseFloat(userListItem.changing)) {
                bot.sendPhoto(user.chat_id, parseFloat(coinData.change) > 0 ? upImage : downImage, {
                    caption: `🪙${coinData.name} (${coinData.symbol})🪙\n Зафиксировано изменение более чем на ${
                        userListItem.changing
                    }%.\n За последние 24 часа ${parseFloat(coinData.change) > 0 ? "рост составил" : "падение составило"} ${coinData.change}%.${
                        parseFloat(coinData.change) > 0 ? "🚀" : "🔻"
                    }\n\n💰Текущая стоимость: ${parseFloat(coinData.price).toFixed(2)}$💰`,
                });
            }
        });
    });
};
