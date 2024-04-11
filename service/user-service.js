const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("../service/mail-service");
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exeptions/api-error");

class UserService {
  async registration(email, password, tg_nickname) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest("User already exist.");
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = `${process.env.API_URL}/api/auth/activate/${uuid.v4()}` ;

    const newUser = {
      email,
      password: hashPassword,
      activationLink,
      tg_nickname,
      chat_id: "",
      avatar_url: "https://s3.coinmarketcap.com/static/img/portraits/633520129b613d3454890380.png",
      balance: 0,
    };

    const user = await UserModel.create(newUser);
    await mailService.sendActivationMAil(email, activationLink); //send actiovation mail
    const userDto = new UserDto(user); // payload for token(id, email, isActivated)
    const tokens = tokenService.generateTokens({ ...userDto }); //generate tokens

    await tokenService.saveToken(userDto.id, tokens.refreshToken); //save refresh token

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Link is invalid");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("User not found");
    }

    const isPassEquals = await bcrypt.compare(password, user.password); //сравниваем пароли
    if (!isPassEquals) {
      throw ApiError.BadRequest("Password is incorrect");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken); //сохраняем рефреш токен

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken); //валидация токена
    const tokenFromDB = await tokenService.findToken(refreshToken); //поиск токена

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken); //сохраняем рефреш токен

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
