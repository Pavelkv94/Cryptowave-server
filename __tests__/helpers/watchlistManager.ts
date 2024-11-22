import { req } from "./req";

export const watchlistManager = {
  async getWatchlist(token: string) {
    const response = await req.get(`/watchlist`).set({ Authorization: "Bearer " + token });

    return response;
  },
  async addWatchItem(payload: any, token: string) {
    const response = await req
      .post(`/watchlist`)
      .send(payload)
      .set({ Authorization: "Bearer " + token });

    return response;
  },
  async deleteWatchItem(watch_id: string, token: string) {
    const response = await req.delete(`/watchlist/${watch_id}`).set({ Authorization: "Bearer " + token });

    return response;
  },
};
