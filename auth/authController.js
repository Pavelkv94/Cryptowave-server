const User = require("../models/User");
const bcrypt = require("bcryptjs"); //хэширование пароля
const { validationResult } = require("express-validator"); //для получения сообщений об ошибках
const jwt = require("jsonwebtoken"); //для работы с jwt
const { secret } = require("../config"); // получаем секретный ключ


//создаем функцию которая принимает ИД и роль и засовываем эт овсе в обьект пайлоад
const generateAccessToken = (id) => {
  const payload = {
    id
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" }); //передаем обьект, секретный ключ который храниться на сервере и опции
};

class authController {
  async registration(req, res) {
    try {
      //валидация
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(req.body);
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, password, tg_nickname } = req.body;
      const candidate = await User.findOne({ username }); //ищем пользователя с этим юзернеймом
      if (candidate) {
        return res.status(400).json({ message: "Пользователь уже существует" });
      }

      var hashPassword = bcrypt.hashSync(password, 7); //Хэшируем пароль

      const user = new User({
        username,
        password: hashPassword,
        balance: 0,
        avatar_url: "https://s3.coinmarketcap.com/static/img/portraits/633520129b613d3454890380.png",
        tg_nickname,
        chat_id: ""
      }); //создаем пользователя

      await user.save(); //сохраняем в БД

      return res.json({ message: "Пользователь зарегестрирован" }); //мессадж
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration Error" });
    }
  }



  async login(req, res) {
    try {
      const { username, password } = req.body; //получаем данные

      const user = await User.findOne({ username }); // ищем юзера
      if (!user) {
       return res.status(400).json({ message: "Пользователь не найден" });
      }

      const validPassword = bcrypt.compareSync(password, user.password); //валидация введенного пароля
      if (!validPassword) {
        return res.status(400).json({ message: "Пароль не верный" });
      }
      

      const token = generateAccessToken(user._id); // _id монго генерирует сам
      return res.json( {username: user.username,  id: user._id, token, balance: user.balance, avatar_url: user.avatar_url, tg_nickname: user.tg_nickname, chat_id: user.chat_id })

    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login Error" });
    }
  }

  async me(req, res) {
    try {
      const { user } = req.params;
      const userData = await User.findOne({ _id: user })
      return res.status(200).json(userData)

    } catch (e) {
      return res.status(403).json({ message: "You are not autorized" });
    }
  }
  async updateAvatar(req, res) {
    const { avatar_url} = req.body;
    const updatedUser = await User.findByIdAndUpdate({ _id: req.params.user_id }, { avatar_url: avatar_url }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }


    res.json(updatedUser)
  }
}

module.exports = new authController();