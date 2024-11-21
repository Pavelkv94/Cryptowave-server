import { TransactionModel } from "../db/models/Transaction";
import { UserModel } from "../db/models/User.model";
import { TransactionViewModel } from "../features/transactions/models/transactions.model";
import { getCoins } from "./helpers/getCoins.api";
import { getLatestPrices } from "./helpers/getLatestPrice";
import { bot } from "./runBot";

export const botService = {
    async startBot(chatId: number, first_name: string = "user", username: string = "unknown") {
        const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
        await UserModel.findOneAndUpdate({ tg_nickname: cleanUsername }, { chat_id: chatId }, { new: true });

        await bot.sendMessage(
            chatId,
            `✨Hello ${first_name}!✨
I am your personal crypto assistant. I can provide you with the current price of BTC, and you can also check your crypto portfolio.`,
            {
                reply_markup: {
                    keyboard: [[{ text: "💰 My Crypto" }, { text: "🪙 BTC" }]],
                    one_time_keyboard: false,
                    resize_keyboard: true,
                },
            }
        );

        return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/9ef/db1/9efdb148-747f-30f8-9575-7f6e06d34bac/7.webp");
    },

    async myCrypto(chatId: number, username: string = "unknown") {
        const result = await TransactionModel.find({ tg_nickname: username }).lean();

        console.log();

        const convertedResult = Object.values(
            result.reduce((acc: any, obj) => {
                if (!acc[obj.coin]) {
                    acc[obj.coin] = [];
                }
                acc[obj.coin].push(obj);
                return acc;
            }, {})
        );

        const { coins } = await getCoins("/coins?limit=100");

        let commonBalance = 0;
        let commonProfit = 0;

        result?.forEach((transaction) => {
            const coin = coins.find((el) => el.name === transaction.coin);

            if (!coin) {
                throw new Error("coin not found");
            }

            if (transaction.operation === "buy") {
                commonBalance += parseFloat(transaction.quantity) * parseFloat(coin.price);
                commonProfit +=
                    parseFloat(transaction.quantity) * parseFloat(coin.price) - parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin);
            }
            if (transaction.operation === "sell") {
                commonBalance -= parseFloat(transaction.quantity) * parseFloat(coin?.price);
                commonProfit -=
                    parseFloat(transaction.quantity) * parseFloat(coin?.price) - parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin);
            }
        });

        const arrayString = convertedResult.map((transactions: any) => {
            let totalBalance = 0;
            let totalProfit = 0;
            let holdings = 0;

            let currentCoin = null;
            transactions.forEach((transaction: TransactionViewModel) => {
                const coin = coins.find((el) => el.name === transaction.coin);

                if (!coin) {
                    throw new Error("coin not found 2");
                }

                currentCoin = { ...coin };

                if (transaction.operation === "buy") {
                    totalBalance += parseFloat(transaction.quantity) * parseFloat(coin?.price);
                    totalProfit +=
                        parseFloat(transaction.quantity) * parseFloat(coin?.price) - parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin);
                    holdings += parseFloat(transaction.quantity);
                }
                if (transaction.operation === "sell") {
                    totalBalance -= parseFloat(transaction.quantity) * parseFloat(coin?.price);
                    totalProfit -=
                        parseFloat(transaction.quantity) * parseFloat(coin?.price) - parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin);
                    holdings -= parseFloat(transaction.quantity);
                }
            });
            return `Название: ${currentCoin!.name}\n 💵Стоимость: ${parseFloat(currentCoin!.price).toFixed(2)}$\n 🔶Всего на балансе:  ${holdings.toFixed(
                2
            )} единиц\n 💰Баланс: ${totalBalance.toFixed(2)}$\n
            ${totalProfit >= 0 ? `🚀Прибыль: ${totalProfit.toFixed(2)}$🚀` : `🔻Убыток: ${totalProfit.toFixed(2)}$🔻`}\n========================== \n `;
        });
        const emptyHistory = "📊 Вы еще не имеете доступных криптовалют/токенов в вашем портфеле.";
        const photourl =
            "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/blogs/35364/images/ENwOVXVQQ92JvaLhiu0L_pexels-pixabay-259027.jpg";
        bot.sendPhoto(chatId, photourl, {
            caption:
                result.length === 0
                    ? emptyHistory
                    : [
                          `🟢Всего: ${commonBalance.toFixed(2)}$ (${commonProfit > 0 ? "+" : "  "}${commonProfit.toFixed(
                              2
                          )}$)🟢  \n========================== \n `,
                          ...arrayString,
                      ].join(" "),
        });
    },
    async showBTC(chatId: number) {
        const response = await getLatestPrices("BTC");
        let currentPrice = response.data.BTC.quote.USD.price.toFixed(2);
        let usdQuote = response.data.BTC.quote.USD;
        const photoUrl = "https://blog.pintu.co.id/wp-content/uploads/2024/08/bitcoin-layer2.jpg";

        await bot.sendPhoto(chatId, photoUrl, {
            caption: `🔥Цена BTC сейчас составляет: ${currentPrice}$\nИзменение за 7 дней ---> ${usdQuote.percent_change_7d.toFixed(
                2
            )}%\nИзменение за 24 часа ---> ${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%)\n${
                usdQuote.percent_change_1h < 0
                    ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час 🔻`
                    : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час 🚀`
            }`,
        });
    },
};
