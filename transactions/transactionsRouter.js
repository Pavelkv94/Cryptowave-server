const Router = require("express");
const router = new Router();
const controller = require("./transactionsController");
const authMiddleware = require('../auth/middleware/authMiddleware');

router.post("/transactions", authMiddleware, controller.createTransaction);
router.get("/user/:user_id/history", authMiddleware, controller.getTransactions);
router.delete("/transactions/:transaction_id", authMiddleware, controller.deleteTransaction);

module.exports = router;