import mongoose from "mongoose";

export const db = {
  async connect(url: string) {
    try {
      await mongoose.connect(url, {
        dbName: process.env.DB_NAME,
      });
      console.log("Connected to MongoDB with Mongoose");
    } catch (error) {
      throw new Error("Mongoose connect Error");
    }
  },

  async disconnect() {
    await mongoose.connection.close();
    console.log("Mongo connection closed");
  },
  async drop() {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
      console.log("Dropped all collections");
    } catch (error) {
      console.error("Mongoose drop db Error: " + error);
      await this.disconnect();
    }
  },
};
