import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { usersManager } from "../helpers/usersManager";
import { createString, fakeId, newTransaction, newUser } from "../helpers/datasets";
import { LoginInputModel } from "../../src/features/auth/models/auth.models";
import { authManager } from "../helpers/authManager";
import { transactionsManager } from "../helpers/transactionsManager";
import { transactionsService } from "../../src/features/transactions/transactions.service";

describe("/transactions", () => {
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
    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(201);
    expect(addTransactionResponse.body.coin).toBe(newTransaction.coin);
    expect(addTransactionResponse.body.quantity).toBe(newTransaction.quantity);
    expect(addTransactionResponse.body.price_per_coin).toBe(newTransaction.price_per_coin);
    expect(addTransactionResponse.body.note).toBe(newTransaction.note);
    expect(addTransactionResponse.body.total).toBe(newTransaction.total);
    expect(addTransactionResponse.body.operation).toBe(newTransaction.operation);
    expect(addTransactionResponse.body.date).toBe(newTransaction.date);
  });
  it("should get transactions", async () => {
    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(201);

    const getTransactionResponse = await transactionsManager.getHistory(accessToken);
    expect(getTransactionResponse.status).toBe(200);
    expect(getTransactionResponse.body.length).toBe(1);
  });
  it("should delete transaction", async () => {
    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(201);

    const deleteTransactionResponse = await transactionsManager.deleteTransaction(addTransactionResponse.body.id, accessToken);
    expect(deleteTransactionResponse.status).toBe(204);

    const getTransactionResponse = await transactionsManager.getHistory(accessToken);
    expect(getTransactionResponse.status).toBe(200);
    expect(getTransactionResponse.body.length).toBe(0);
  });

  it("shouldn't get transactions 500", async () => {
    const originMethod = transactionsService.getTransactions;

    transactionsService.getTransactions = jest.fn().mockRejectedValue(new Error("DB Error"));

    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(201);

    const getTransactionResponse = await transactionsManager.getHistory(accessToken);
    expect(getTransactionResponse.status).toBe(500);

    transactionsService.getTransactions = originMethod;
  });

  it("shouldn't delete transactions 500", async () => {
    const originMethod = transactionsService.deleteTransaction;

    transactionsService.deleteTransaction = jest.fn().mockRejectedValue(new Error("DB Error"));

    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(201);

    const deleteTransactionResponse = await transactionsManager.deleteTransaction(addTransactionResponse.body.id, accessToken);
    expect(deleteTransactionResponse.status).toBe(500);

    transactionsService.deleteTransaction = originMethod;
  });
  it("shouldn't delete transactions 404", async () => {
    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(201);

    const deleteTransactionResponse = await transactionsManager.deleteTransaction(fakeId, accessToken);
    expect(deleteTransactionResponse.status).toBe(404);
  });

  it("shouldn't add transactions 500", async () => {
    const originMethod = transactionsService.createTransaction;

    transactionsService.createTransaction = jest.fn().mockRejectedValue(new Error("DB Error"));

    const addTransactionResponse = await transactionsManager.addTransaction(newTransaction, accessToken);
    expect(addTransactionResponse.status).toBe(500);

    transactionsService.createTransaction = originMethod;
  });

  it("shouldn't add transactions 400", async () => {
    const newInvalidTransaction = {
      coin: true,
      quantity: true,
      price_per_coin: true,
      note: createString(121),
      total: true,
      operation: "buys",
      date: "12-02-2024",
    };

    const addTransactionResponse = await transactionsManager.addTransaction(newInvalidTransaction, accessToken);
    expect(addTransactionResponse.body.errorsMessages.length).toBe(6);
  });
});
