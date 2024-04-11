const Router = require("express");
const router = new Router();
const controller = require("../controllers/watcher-controller");
const authMiddleware = require('../middlewares/auth-middleware');

router.post("/watchlist", authMiddleware, controller.addWatchItem);
router.get("/user/:user_id/watchlist", authMiddleware, controller.getWatchList);
router.delete("/watchlist/:watchlist_item_id", authMiddleware, controller.deleteWatchItem);

module.exports = router;