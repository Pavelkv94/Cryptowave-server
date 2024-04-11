const { validationResult } = require("express-validator"); 
const CoinsWatch = require("../models/CoinsWatch");

class watcherController {
  async addWatchItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка при регистрации", errors });
      }

      const { symbol, name, iconUrl, tg_nickname, user_id, changing } = req.body;

      const newWatchItem = new CoinsWatch({
        symbol,
        name,
        iconUrl,
        tg_nickname,
        user_id,
        changing
      });

      const savedWatchItem = await newWatchItem.save();

      res.json(savedWatchItem);
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Registration Error" });
    }
  }

  async getWatchList(req, res) {
    const result = await CoinsWatch.find({ user_id: req.params.user_id });

    if (!result) {
      return res.status(404).json({ error: "History not found" });
    } else {
      res.json(result);
    }
  }

  async deleteWatchItem(req, res) {
    const result = await CoinsWatch.deleteOne({ _id: req.params.watchlist_item_id });
    if (!result) {
      return res.status(404).json({ error: "History not found" });
    } else {
      console.log("delete success!");
      res.json(result);
    }
  }
}

module.exports = new watcherController();
