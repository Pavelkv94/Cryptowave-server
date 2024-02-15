const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
const authRouter = require("./auth/authRouter");
const transactionsRouter = require("./transactions/transactionsRouter");
const watcherRouter = require("./watcher/watcherRouter");

const bot = require("./bot");
const { startBot, myCrypto, showBTC } = require("./botOptions");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
// const url = "mongodb://127.0.0.1/orcusDataBase"; //For local
const url = `mongodb+srv://${process.env.DB_OWNER}:${process.env.DB_PASS}@clusterfortgbot.hi5sp.mongodb.net/Cryptowave?retryWrites=true&w=majority`;
// Установим подключение по умолчанию
mongoose
  .connect(url)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;

// Получение подключения по умолчанию
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const server = express();

server.use(cors({ origin: "*" })); //!------CORS DANGER

server.use(express.json());
server.use(Router);
server.use(authRouter);
server.use(transactionsRouter);
server.use(watcherRouter);

server.use(
  express.static("public", {
    setHeaders: function setHeaders(res, path, stat) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
    },
  })
);

const start = async () => {
  try {
    await mongoose.connect(url);
    server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
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
