require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bot = require("./bot/bot");
const { startBot, myCrypto, showBTC } = require("./bot/botOptions");
const { monitorPrice } = require("./bot/monitorPrice");
const authRouter = require("./router/auth-router");
const transactionsRouter = require("./router/transactions-router");
const watcherRouter = require("./router/watcher-router");

const errorMiddleware = require("./middlewares/error-middleware");

const PORT = process.env.PORT || 3007;
const databaseUrl = `mongodb+srv://${process.env.DB_OWNER}:${process.env.DB_PASS}@clusterfortgbot.hi5sp.mongodb.net/Cryptowave?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL 
}));

app.use("/api/auth", authRouter);
app.use("/api/operations", transactionsRouter);
app.use("/api/watch/",watcherRouter);
app.use(errorMiddleware);

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const start = async () => {
  try {
    await mongoose
      .connect(databaseUrl)
      .then(() => console.log("DB connected"))
      .catch((err) => {
        console.log(err);
      });

    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};


// Set up the Telegram bot
const botActions = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const first_name = msg.from.first_name;
    const username = msg.from.username;

    try {
      if (text === "/start") {
        startBot(chatId, first_name, username);
      } else if (text === '💰 My Crypto') {
        myCrypto(chatId, username);
      } else if (text === '🪙 BTC') {
        showBTC(chatId, username);
      }
    } catch (e) {
      console.log(e);
      return bot.sendMessage(chatId, "Ой! Произошла серьезная ошибка!");
    }
  });
};


botActions();
start();

setInterval(() => monitorPrice(), 1800 * 1000); //86400 - 24h
