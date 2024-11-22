import { req } from "./req";

export const transactionsManager = {
  async getHistory(token: string) {
    const response = await req.get(`/transactions/history`).set({ Authorization: "Bearer " + token });

    return response;
  },
  async addTransaction(payload: any, token: string) {
    const response = await req
      .post(`/transactions`)
      .send(payload)
      .set({ Authorization: "Bearer " + token });

    return response;
  },
  async deleteTransaction(id: string, token: string) {
    const response = await req.delete(`/transactions/${id}`).set({ Authorization: "Bearer " + token });

    return response;
  },
};
