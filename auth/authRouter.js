const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator"); //валидатор
const authMiddleware = require('./middleware/authMiddleware');

router.post(
  "/registration",
  [check("username", "Имя пользователя не может быть пустым").notEmpty(), //todo вторым параметром валидация, первый параметр это проверяемое поле, второе это сообщение
check("password", " Пароль должен быть больше 4 и меньше 10 символов").isLength({min: 4, max: 10})],
  controller.registration
);
router.post("/login", controller.login);
router.post("/user/:user_id/updateAvatar", controller.updateAvatar);

router.get("/me/:user", authMiddleware, controller.me);
// router.get("/users", authMiddleware,  controller.getUsers); //todo добавляем мидлварю чтоб только зареганый юзер мог сделать такой запрос

module.exports = router;