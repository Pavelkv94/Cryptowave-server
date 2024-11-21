import { randomUUID } from "crypto";
import { bcryptService } from "../../adapters/bcrypt.service";
import { UserModel } from "../../db/models/User.model";
import { UserViewDto } from "./dto";
import { UserEntityModel, UserInputModel, UserViewModel } from "./models/users.models";
import { getExpirationDate } from "../../utils/getExpirationDate";

export const usersService = {
    async getUsers() {
        const users = await UserModel.find({});

        return UserViewDto.mapToViewArray(users);
    },
    async findUser(user_id: string): Promise<UserViewModel | null> {
        const user = await UserModel.findOne({ _id: user_id });

        if (user) {
            return UserViewDto.mapToView(user);
        }
        return null;
    },
    async findUserByEmail(email: string): Promise<UserViewModel | null> {
        const user = await UserModel.findOne({ email: email });

        if (user) {
            return UserViewDto.mapToView(user);
        }
        return null;
    },

    async findUserByCode(code: string): Promise<UserViewModel | null> {
        const user = await UserModel.findOne({ "emailConfirmation.confirmationCode": code });

        if (user) {
            return UserViewDto.mapToView(user);
        }
        return null;
    },
    async create(payload: UserInputModel): Promise<UserViewModel> {
        const passwordhash = await bcryptService.generateHash(payload.password);

        const newUser: UserEntityModel = {
            email: payload.email,
            password: passwordhash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: getExpirationDate(30),
                isConfirmed: false,
            },
            balance: 0,
            avatar_url: "https://s3.coinmarketcap.com/static/img/portraits/633520129b613d3454890380.png",
            tg_nickname: payload.tg_nickname,
            chat_id: "",
        };

        const user = await UserModel.create(newUser);

        return UserViewDto.mapToView(user);
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ _id: id });
        return result.deletedCount > 0;
    },
    async updateAvatar(user_id: string, avatar_url: string): Promise<boolean> {
        const result = await UserModel.updateOne({ _id: user_id }, { $set: { avatar_url: avatar_url } });
        return result.matchedCount > 0;
    },
};
