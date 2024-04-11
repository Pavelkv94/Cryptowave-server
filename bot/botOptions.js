const bot = require("./bot");
const Transactions = require("../models/Transactions");
const User = require("../models/UserModel");
const { getCoins, getLatestPrices } = require("../getCoinsRequest");

module.exports = {
  async startBot(chatId, first_name, username) {
    await User.findOneAndUpdate({ tg_nickname: username }, { chat_id: chatId }, { new: true });

    await bot.sendMessage(chatId, `Приветствую тебя ${first_name}! Я твой личный крипто ассистент.`, {
      reply_markup: {
        keyboard: [[{ text: "💰 My Crypto" }, { text: "🪙 BTC" }]],
        one_time_keyboard: false,
        resize_keyboard: true,
      },
    });

    return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/9ef/db1/9efdb148-747f-30f8-9575-7f6e06d34bac/7.webp");
  },

  async myCrypto(chatId, username) {
    const result = await Transactions.find({ tg_nickname: username });

    const convertedResult = Object.values(
      result.reduce((acc, obj) => {
        if (!acc[obj.coin]) {
          acc[obj.coin] = [];
        }
        acc[obj.coin].push(obj);
        return acc;
      }, {})
    );

    await getCoins()
      .then((res) => res.data.coins)
      .then((coins) => {
        
        let commonBalance = 0;
        let commonProfit = 0;

        result?.forEach((transaction) => {
            const coin = coins.find((el) => el.name === transaction.coin);
            if (transaction.operation === "buy") {
                commonBalance += parseFloat(transaction.quantity) * parseFloat(coin?.price);
                commonProfit += (parseFloat(transaction.quantity) * parseFloat(coin?.price) - (parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin)))
            }
            if (transaction.operation === "sell") {
                commonBalance -= parseFloat(transaction.quantity) * parseFloat(coin?.price);
                commonProfit -= (parseFloat(transaction.quantity) * parseFloat(coin?.price) - (parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin)))
            }
        });

        const arrayString = convertedResult.map((transactions) => {
          let totalBalance = 0;
          let totalProfit = 0;
          let holdings = 0;

          let currentCoin = null;
          transactions.forEach((transaction) => {
            const coin = coins.find((el) => el.name === transaction.coin);
            currentCoin = { ...coin };

            if (transaction.operation === "buy") {
              totalBalance += parseFloat(transaction.quantity) * parseFloat(coin?.price);
              totalProfit += parseFloat(transaction.quantity) * parseFloat(coin?.price) - parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin);
              holdings += parseFloat(transaction.quantity);
            }
            if (transaction.operation === "sell") {
              totalBalance -= parseFloat(transaction.quantity) * parseFloat(coin?.price);
              totalProfit -= parseFloat(transaction.quantity) * parseFloat(coin?.price) - parseFloat(transaction.quantity) * parseFloat(transaction.price_per_coin);
              holdings -= parseFloat(transaction.quantity);
            }
          });
          return `Название: ${currentCoin?.name}\n 💵Стоимость: ${parseFloat(currentCoin?.price).toFixed(2)}$\n 🔶Всего на балансе:  ${parseFloat(holdings).toFixed(2)} единиц\n 💰Баланс: ${parseFloat(totalBalance).toFixed(2)}$\n
          ${totalProfit >= 0 ? `🚀Прибыль: ${parseFloat(totalProfit).toFixed(2)}$🚀` : `🔻Убыток: ${parseFloat(totalProfit).toFixed(2)}$🔻`}\n========================== \n `;
        });
        const emptyHistory = "📊 Вы еще не имеете доступных криптовалют/токенов в вашем портфеле.";

          bot.sendPhoto(chatId, './assets/portfel.png', {
            caption: result.length === 0 ? emptyHistory : [`🟢Всего: ${parseFloat(commonBalance).toFixed(2)}$ (${commonProfit > 0 ? "+" : "  "}${parseFloat(commonProfit).toFixed(2)}$)🟢  \n========================== \n `, ...arrayString].join(" ")
          })
      });
  },

  async showBTC (chatId) {
    await getLatestPrices("BTC")
    .then((res) =>  {
    let currentPrice = res.data.BTC.quote.USD.price.toFixed(2);
    let usdQuote = res.data.BTC.quote.USD;

    bot.sendPhoto(chatId, './assets/Bitcoin.png', {
      caption: `🔥Цена BTC сейчас составляет: ${currentPrice}$\nИзменение за 7 дней ---> ${usdQuote.percent_change_7d.toFixed(2)}%\nИзменение за 24 часа ---> ${usdQuote.volume_change_24h.toFixed(2)}$(${usdQuote.percent_change_24h.toFixed(2)}%)\n${
        usdQuote.percent_change_1h < 0
          ? `Падение на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час 🔻`
          : `Рост на ${usdQuote.percent_change_1h.toFixed(2)}% за последний час 🚀`
        }`,
      });
    })
  },






};
