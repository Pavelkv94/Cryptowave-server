import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { usersManager } from "../helpers/usersManager";
import { createString, fakeId, newWatchItem, newUser } from "../helpers/datasets";
import { LoginInputModel } from "../../src/features/auth/models/auth.models";
import { authManager } from "../helpers/authManager";
import { watchlistManager } from "../helpers/watchlistManager";
import { watchlistService } from "../../src/features/watchlist/watchlist.service";

describe("/watchlist", () => {
  let mongoServer: MongoMemoryServer;
  let accessToken: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.connect(url);
  });

  beforeEach(async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      email: newUser.email,
      password: newUser.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(200);
    accessToken = loginUserResponse.body.accessToken;
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await db.drop();
  });

  afterAll(async () => {
    await mongoServer.stop();
    await db.disconnect();
  });

  it("should add transactions", async () => {
    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(201);
    expect(addWatchitemResponse.body.symbol).toBe(newWatchItem.symbol);
    expect(addWatchitemResponse.body.name).toBe(newWatchItem.name);
    expect(addWatchitemResponse.body.iconUrl).toBe(newWatchItem.iconUrl);
    expect(addWatchitemResponse.body.changing).toBe(newWatchItem.changing);
  });

  it("should get transactions", async () => {
    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(201);

    const getWatchlistResponse = await watchlistManager.getWatchlist(accessToken);
    expect(getWatchlistResponse.status).toBe(200);
    expect(getWatchlistResponse.body.length).toBe(1);
  });
  it("should delete transaction", async () => {
    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(201);

    const deleteWatchItemResponse = await watchlistManager.deleteWatchItem(addWatchitemResponse.body.id, accessToken);
    expect(deleteWatchItemResponse.status).toBe(204);

    const getWatchlistResponse = await watchlistManager.getWatchlist(accessToken);
    expect(getWatchlistResponse.status).toBe(200);
    expect(getWatchlistResponse.body.length).toBe(0);
  });

  it("shouldn't get transactions 500", async () => {
    const originMethod = watchlistService.getWatchlist;

    watchlistService.getWatchlist = jest.fn().mockRejectedValue(new Error("DB Error"));

    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(201);

    const getWatchlistResponse = await watchlistManager.getWatchlist(accessToken);
    expect(getWatchlistResponse.status).toBe(500);

    watchlistService.getWatchlist = originMethod;
  });

  it("shouldn't delete transactions 500", async () => {
    const originMethod = watchlistService.deleteWatchItem;

    watchlistService.deleteWatchItem = jest.fn().mockRejectedValue(new Error("DB Error"));

    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(201);

    const deleteWatchItemResponse = await watchlistManager.deleteWatchItem(addWatchitemResponse.body.id, accessToken);
    expect(deleteWatchItemResponse.status).toBe(500);

    watchlistService.deleteWatchItem = originMethod;
  });
  it("shouldn't delete transactions 404", async () => {
    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(201);

    const deleteWatchItemResponse = await watchlistManager.deleteWatchItem(fakeId, accessToken);
    expect(deleteWatchItemResponse.status).toBe(404);
  });

  it("shouldn't add transactions 500", async () => {
    const originMethod = watchlistService.addWatchItem;

    watchlistService.addWatchItem = jest.fn().mockRejectedValue(new Error("DB Error"));

    const addWatchitemResponse = await watchlistManager.addWatchItem(newWatchItem, accessToken);
    expect(addWatchitemResponse.status).toBe(500);

    watchlistService.addWatchItem = originMethod;
  });
});
