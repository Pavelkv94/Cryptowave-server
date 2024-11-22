import { UserInputModel } from "../../src/features/users/models/users.models";
import { fromUTF8ToBase64 } from "../../src/utils/base64";

export const codedAuth = fromUTF8ToBase64("admin:qwerty");

export const newUser: UserInputModel = {
  email: "example@example.com",
  password: "123123123",
  tg_nickname: "test_app",
};
export const createString = (length: number) => {
  let s = "";
  for (let x = 1; x <= length; x++) {
    s += x % 10;
  }
  return s;
};

export const newTransaction = {
  coin: "btc",
  quantity: "12",
  price_per_coin: "1000",
  note: "note",
  total: "2",
  operation: "buy",
  date: "12-02-2024",
};

export const newWatchItem = {
  symbol: "btc",
  name: "test",
  iconUrl: "test",
  changing: "20",
};

export const fakeId: string = "66fe520519de2ba63a26d417";
