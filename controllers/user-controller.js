const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/api-error");
const UserModel = require("../models/UserModel");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Registration error", errors.array()));
      }
      const { email, password, tg_nickname } = req.body;

      const userData = await userService.registration(email, password, tg_nickname);

      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); //save refresh token in cookies
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); //save refresh token in cookies
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL); //редирект после подтверждения
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); //сохраняем рефреш токен в куках
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res) {
    const { avatar_url } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate({ _id: req.params.user_id }, { avatar_url: avatar_url }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  }


  async getAvarar(req, res) {

    const currentUser = await UserModel.findById({ _id: req.params.user_id });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(currentUser.avatar_url);
  }

  
}

module.exports = new UserController();
