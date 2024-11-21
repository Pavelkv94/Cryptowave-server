import { EmailConfirmationEntityType, UserDocument, UserViewModel } from "./models/users.models";

export class UserViewDto {
  id: string;
  email: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationEntityType;
  balance: number;
  avatar_url: string;
  tg_nickname: string;
  chat_id: string;

  constructor(model: UserDocument) {
    this.id = model._id.toString();
    this.email = model.email;
    this.createdAt = model.createdAt;
    this.emailConfirmation = model.emailConfirmation;
    this.balance = model.balance;
    this.avatar_url = model.avatar_url;
    this.tg_nickname = model.tg_nickname;
    this.chat_id = model.chat_id;
  }

  static mapToView(user: UserDocument): UserViewDto {
    return new UserViewDto(user);
  }

  static mapToViewArray(users: UserDocument[]): UserViewModel[] {
    return users.map((user) => this.mapToView(user));
  }
}
