import { UserInputModel } from "../../src/features/users/models/users.models";
import { fromUTF8ToBase64 } from "../../src/utils/base64";
import { req } from "./req";

export const codedAuth = fromUTF8ToBase64(process.env.ADMIN!);

export const usersManager = {
  async getUsersWithAuth() {
    const response = await req.get(`/users`).set({ Authorization: "Basic " + codedAuth });

    return response;
  },
  async getUsersWithoutAuth() {
    const response = await req.get(`/users`);
    return response;
  },
  async getUsersWithInvalidToken(query?: string) {
    const response = await req.get(`/users`).set({ Authorization: "Basic " + "invalid" });
    return response;
  },
  async getUsersWithInvalidAuthHeader(query?: string) {
    const response = await req.get(`/users`).set({ Authorization: "BasicInvalidHeader " + codedAuth });
    return response;
  },

  async createUser(data: UserInputModel) {
    const response = await req
      .post("/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },

  async deleteUser(id: string) {
    const response = await req.delete(`/users/${id}`).set({ Authorization: "Basic " + codedAuth });

    return response;
  },

  async updateAvatar(avatar_url: string, refreshToken: string) {
    const response = await req
      .post(`/users/updateAvatar`)
      .send({ avatar_url })
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    return response;
  },
};
