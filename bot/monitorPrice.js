const bot = require("./bot");
const { getCoins } = require("../getCoinsRequest");
const CoinsWatch = require("../models/CoinsWatch");
const User = require("../models/UserModel");

module.exports = {
  async monitorPrice() {
    const watchList = await CoinsWatch.find({});
    const users = await User.find({});

    const usersWithWatchList = users.filter(user => watchList.some(obj => obj.tg_nickname === user.tg_nickname));

    if (!watchList) {
      return res.status(404).json({ error: "Watch list not found" });
    } else {
      //   console.log(result)
    }

    await getCoins().then((res) => {
        usersWithWatchList.forEach(user => {
            const userWatchList = watchList.filter(list => list.tg_nickname === user.tg_nickname);

            userWatchList.forEach(userListItem => {
                const coinData = res.data.coins.find(el => el.name === userListItem.name);
                if(parseFloat(coinData.change) >= parseFloat(userListItem.changing)) {
                    bot.sendPhoto(user.chat_id, "./assets/graph.png", {caption: `🪙${coinData.name} (${coinData.symbol})🪙\n Зафиксировано изменение более чем на ${userListItem.changing}%.\n За последние 24 часа ${parseFloat(coinData.change) > 0 ? "рост составил" : "падение составило"} ${coinData.change}%.${parseFloat(coinData.change) > 0 ? "🚀" : "🔻"}\n\n💰Текущая стоимость: ${parseFloat(coinData.price).toFixed(2)}$💰`})
                }
            })
        })
    });
  },
};