import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { usersManager } from "../helpers/usersManager";
import { usersService } from "../../src/features/users/users.service";
import { createString, fakeId, newUser } from "../helpers/datasets";
import { LoginInputModel } from "../../src/features/auth/models/auth.models";
import { authManager } from "../helpers/authManager";

describe("/users", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.connect(url);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await db.drop();
  });

  afterAll(async () => {
    await mongoServer.stop();
    await db.disconnect();
  });

  it("should return empty array", async () => {
    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.body.length).toBe(0);
  });

  it("should return 401 error", async () => {
    const getUsersResponseWithoutAuth = await usersManager.getUsersWithoutAuth();
    expect(getUsersResponseWithoutAuth.status).toBe(401);

    const getUsersResponseWithInvalidAuthHeader = await usersManager.getUsersWithInvalidAuthHeader();
    expect(getUsersResponseWithInvalidAuthHeader.status).toBe(401);

    const getUsersResponseWithInvalidToken = await usersManager.getUsersWithInvalidToken();
    expect(getUsersResponseWithInvalidToken.status).toBe(401);
  });
  it("should call next with ApiError.UnexpectedError when usersService.getUsers throws an error", async () => {
    let originalGetUsers = usersService.getUsers;
    const errorMessage = "Something went wrong";
    usersService.getUsers = jest.fn().mockRejectedValue(new Error(errorMessage));

    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.status).toBe(500);

    usersService.getUsers = originalGetUsers;
  });

  it("should create user and return new user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);
    expect(Object.keys(createUserResponse.body).length).toBe(8);
    expect(createUserResponse.body.email).toBe(newUser.email);
  });

  it("should create user and return new user", async () => {
    const originMethod = usersService.create;

    usersService.create = jest.fn().mockRejectedValue(new Error("DB Error"));

    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(500);
    usersService.create = originMethod;
  });

  it("shouldn't create user with the same data", async () => {
    const createUserResponse2 = await usersManager.createUser(newUser);
    expect(createUserResponse2.status).toBe(201);
    const createUserResponse3 = await usersManager.createUser(newUser);
    expect(createUserResponse3.status).toBe(400);
    expect(createUserResponse3.body.errorsMessages.length).toBe(2);
  });

  it("shouldn't create user", async () => {
    const newInvalidUser = {
      tg_nickname: createString(4),
      password: createString(4),
      email: createString(10),
    };

    const createUserResponse = await usersManager.createUser(newInvalidUser);
    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body.errorsMessages.length).toBe(3);

    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.body.length).toBe(0);
  });

  it("should delete user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const deleteUserResponse = await usersManager.deleteUser(createUserResponse.body.id);
    expect(deleteUserResponse.status).toBe(204);

    const getUsersResponse2 = await usersManager.getUsersWithAuth();
    expect(getUsersResponse2.body.length).toBe(0);
  });

  it("should delete user 500", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const originMethod = usersService.deleteUser;

    usersService.deleteUser = jest.fn().mockRejectedValue(new Error("DB Error"));

    const deleteUserResponse = await usersManager.deleteUser(createUserResponse.body.id);
    expect(deleteUserResponse.status).toBe(500);
    usersService.deleteUser = originMethod;
  });

  it("shouldn't delete user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const deleteUserResponse = await usersManager.deleteUser(fakeId);
    expect(deleteUserResponse.status).toBe(404);

    const getUsersResponse2 = await usersManager.getUsersWithAuth();
    expect(getUsersResponse2.body.length).toBe(1);
  });

  it("should update avatar", async () => {
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

    const newAvatarUrl = "http://some.img";
    const updateAvatarResponse = await usersManager.updateAvatar(newAvatarUrl, refreshToken);
    expect(updateAvatarResponse.status).toBe(204);
  });

  it("shouldn't update avatar", async () => {
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

    const newAvatarUrl = "http://some.img";

    const originMethod = usersService.updateAvatar;

    usersService.updateAvatar = jest.fn().mockRejectedValue(new Error("DB Error"));

    const updateAvatarResponse = await usersManager.updateAvatar(newAvatarUrl, refreshToken);
    expect(updateAvatarResponse.status).toBe(500);
    usersService.updateAvatar = originMethod;
  });
});
