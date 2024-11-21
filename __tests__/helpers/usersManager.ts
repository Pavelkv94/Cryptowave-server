import { UserInputModel } from "../../src/features/users/models/users.models";
import { codedAuth } from "./datasets";
import { req } from "./req";

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

  // async passwordRecovery(email: string) {
  //   const response = await req.post(`${SETTINGS.PATH.AUTH}/password-recovery`).send({ email });

  //   return response;
  // },
};
