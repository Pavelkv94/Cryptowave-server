import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import mongoose from "mongoose";

describe("DB", () => {
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
  
  it("should throw an error if connection fails", async () => {
    const errorMessage = "Connection failed";
    mongoose.connect = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    const url = mongoServer.getUri();

    await expect(db.connect(url)).rejects.toThrow("Mongoose connect Error");
  });
});
