const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require('./middleware/authMiddleware');

router.post(
  "/registration",
  [check("username", "Имя пользователя не может быть пустым").notEmpty(),
check("password", " Пароль должен быть больше 4 и меньше 10 символов").isLength({min: 4, max: 10})],
  controller.registration
);
router.post("/login", controller.login);
router.post("/user/:user_id/updateAvatar", controller.updateAvatar);

router.get("/me/:user", authMiddleware, controller.me);

module.exports = router;