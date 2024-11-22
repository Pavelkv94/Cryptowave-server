import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { nodemailerService } from "../../src/adapters/mail.service";
import { authManager } from "../helpers/authManager";
import { createString, newUser } from "../helpers/datasets";
import { usersManager } from "../helpers/usersManager";
import { usersService } from "../../src/features/users/users.service";
import { LoginInputModel } from "../../src/features/auth/models/auth.models";
import { jwtService } from "../../src/adapters/jwt/jwt.service";

describe("/test", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.connect(url);
  });

  afterAll(async () => {
    await mongoServer.stop();
    await db.disconnect();
  });

  afterEach(async () => {
    await db.drop();
  });

  it("should register user", async () => {
    const fakeSendMail = () => Promise.resolve(true);
    const originalSendLetter = nodemailerService.sendLetter;

    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    const registerUserResponse = await authManager.registerUser(newUser);
    expect(registerUserResponse.status).toBe(204);
    nodemailerService.sendLetter = originalSendLetter;
  });

  it("shouldn't register user if he exist", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);
    const originalSendLetter = nodemailerService.sendLetter;

    const fakeSendMail = () => Promise.resolve(true);
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    const registerUserResponse = await authManager.registerUser(newUser);
    expect(registerUserResponse.status).toBe(400);
    nodemailerService.sendLetter = originalSendLetter;
  });

  it("should register user and check confirmation code", async () => {
    const fakeSendMail = () => Promise.resolve(true);
    const originalSendLetter = nodemailerService.sendLetter;
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    const registrationResponse = await authManager.registerUser(newUser);
    expect(registrationResponse.status).toBe(204);

    const user = await usersService.findUserByEmail(newUser.email);

    const confirmResponse = await authManager.confirmation(user!.emailConfirmation!.confirmationCode);
    expect(confirmResponse.status).toBe(204);
    nodemailerService.sendLetter = originalSendLetter;
  });

  it("User should login", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    console.log("Create User Response:", createUserResponse.body); // Логируем ответ

    expect(createUserResponse.status).toBe(201);

    
    const loginData: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    console.log("login User Response:", loginUserResponse.body); // Логируем ответ

    expect(loginUserResponse.status).toBe(200);
    expect(loginUserResponse.body).toHaveProperty("accessToken");

    const loginData2: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };
    const loginUserResponse2 = await authManager.loginUser(loginData2);
    expect(loginUserResponse2.status).toBe(200);
  });

  it("User shouldn't login", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      email: "Invalid",
      password: newUser.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(404);

    const loginData2: LoginInputModel = {
      email: newUser.email,
      password: "1234",
    };
    const loginUserResponse2 = await authManager.loginUser(loginData2);
    expect(loginUserResponse2.status).toBe(404);
  });

  it("User shouldn't login with incorrect data", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData = {
      email: newUser.email,
    };
    const loginUserResponse = await authManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(400);
    expect(loginUserResponse.body.errorsMessages.length).toBe(1);

    const loginData2 = {
      password: newUser.password,
    };
    const loginUserResponse2 = await authManager.loginUser(loginData2);
    expect(loginUserResponse2.status).toBe(400);
    expect(loginUserResponse2.body.errorsMessages.length).toBe(1);
  });

  it("/ME should return me user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(200);
    expect(loginUserResponse.body).toHaveProperty("accessToken");

    const meResponse = await authManager.getMe(loginUserResponse.body.accessToken);
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.email).toBe(newUser.email);
  });

  it("shouldn't register user with incorrect data", async () => {
    const newInvalidUser = {
      login: createString(12),
      password: createString(4),
      email: createString(10),
    };

    const fakeSendMail = () => Promise.resolve(true);
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    const registerUserResponse = await authManager.registerUser(newInvalidUser);
    expect(registerUserResponse.status).toBe(400);
    expect(registerUserResponse.body.errorsMessages.length).toBe(3);
  });

  // it("should resend confirmation code", async () => {
  //   const fakeSendMail = () => Promise.resolve(true);
  //   nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);s

  //   const registrationResponse = await authManager.registerUser(newUser);
  //   expect(registrationResponse.status).toBe(204);

  //   const user = await usersService.findUserByEmail(newUser.email);

  //   const emailConfirmation = await usersService..findEmailConfirmationByUser(user!.id);

  //   const resendResponse = await authManager.resendEmail(user!.email);
  //   expect(resendResponse.status).toBe(204);

  //   const newEmailConfirmation = await usersQueryRepository.findEmailConfirmationByUser(user!.id);

  //   const confirmResponse = await authManager.confirmation(newEmailConfirmation!.confirmationCode);
  //   expect(confirmResponse.status).toBe(204);

  //   expect(emailConfirmation!.confirmationCode).not.toBe(newEmailConfirmation!.confirmationCode);
  // });

  it("shouldn't register user with wrong confirmation code", async () => {
    const fakeSendMail = () => Promise.resolve(true);
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    const registrationResponse = await authManager.registerUser(newUser);
    expect(registrationResponse.status).toBe(204);

    const confirmResponse = await authManager.confirmation("invalidConfirmationCode");

    expect(confirmResponse.status).toBe(400);
    expect(confirmResponse.body.errorsMessages.length).toBe(1);
  });

  // it("shouldn't register user if he confirmed", async () => {
  //   const createUserResponse = await usersManager.createUser(newUser);
  //   expect(createUserResponse.status).toBe(201);

  //   const user = await usersQueryRepository.findUserByEmail(newUser.email);

  //   const emailConfirmation = await usersQueryRepository.findEmailConfirmationByUser(user!.id);

  //   const confirmResponse = await authManager.confirmation(emailConfirmation!.confirmationCode);

  //   expect(confirmResponse.status).toBe(400);
  //   console.log(confirmResponse.body.errorsMessages);

  //   expect(confirmResponse.body.errorsMessages.length).toBe(1);
  // });

  it("should refresh token", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(200);

    const cookies = loginUserResponse.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const refreshResponse = await authManager.refresh(refreshToken);
    expect(refreshResponse.status).toBe(200);
  });

  it("shouldn't refresh token", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(200);

    const cookies = loginUserResponse.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const refreshResponse = await authManager.refresh(refreshToken);
    expect(refreshResponse.status).toBe(200);

    const refreshResponse2 = await authManager.refresh("invalid");
    expect(refreshResponse2.status).toBe(401);
  });

  it("should get error after 5 login attempts", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };

    for (let i = 0; i < 5; i++) {
      const loginUserResponse = await authManager.loginUser(loginData);
      expect(loginUserResponse.status).toBe(200);
    }
    const loginUserResponse2 = await authManager.loginUser(loginData);
    expect(loginUserResponse2.status).toBe(429);
  });
});
