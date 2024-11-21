import { req } from "./req";

export const authManager = {
  async registerUser(data: any) {
    const response = await req.post("/auth/registration").send(data);

    return response;
  },

  async confirmation(code: string) {
    const response = await req.post("/auth/registration-confirmation").send({ code });

    return response;
  },

  async loginUser(data: any) {
    const response = await req.post("/auth/login").send(data);

    return response;
  },
  async getMe(token: string) {
    const response = await req.get("/auth/me").set({ Authorization: "Bearer " + token });

    return response;
  },
  //   async logoutUser(refreshToken: any) {
  //     const response = await req.post(SETTINGS.PATH.AUTH + "/logout").set("Cookie", [`refreshToken=${refreshToken}`]);

  //     return response;
  //   },
  //   async loginUserWithAgent(data: any, agent: string) {
  //     const response = await req
  //       .post(SETTINGS.PATH.AUTH + "/login")
  //       .set("User-Agent", agent)
  //       .send(data);

  //     return response;
  //   },
  //   async loginUserWithAgentAndOldCookies(data: any, agent: string, refreshToken: any) {
  //     const response = await req
  //       .post(SETTINGS.PATH.AUTH + "/login")
  //       .set("User-Agent", agent)
  //       .set("Cookie", [`refreshToken=${refreshToken}`])
  //       .send(data);

  //     return response;
  //   },

  //   async resendEmail(email: string) {
  //     const response = await req.post(SETTINGS.PATH.AUTH + "/registration-email-resending").send({ email });

  //     return response;
  //   },

    async refresh(refreshToken?: string) {
      const response = await req.post("/auth/refresh").set("Cookie", [`refreshToken=${refreshToken}`]);

      return response;
    },
};
