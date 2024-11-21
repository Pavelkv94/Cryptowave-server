import TelegramApi, { Message } from "node-telegram-bot-api";
import { config } from "dotenv";
import { botService } from "./bot.service";

config();

const token = process.env.BOT_TOKEN || "";

export const bot = new TelegramApi(token, { polling: true });

export const runBot = () => {
  console.log("tg bot ran");
  bot.on("message", async (msg: Message) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const first_name = msg.from?.first_name;
    const username = msg.from?.username;

    try {
      if (text === "/start") {
        await botService.startBot(chatId, first_name, username);
      } else if (text === "💰 My Crypto") {
        await botService.myCrypto(chatId, username);
      } else if (text === "🪙 BTC") {
        await botService.showBTC(chatId);
      }
    } catch (e) {
      console.log(e);
      return bot.sendMessage(chatId, "Ой! Произошла серьезная ошибка!");
    }
    return null;
  });
};
