const Router = require("express");
const router = new Router();
const controller = require("../controllers/transactions-controller");
const authMiddleware = require('../middlewares/auth-middleware');

router.post("/transactions", authMiddleware, controller.createTransaction);
router.get("/user/:user_id/history", authMiddleware, controller.getTransactions);
router.delete("/transactions/:transaction_id", authMiddleware, controller.deleteTransaction);

module.exports = router;