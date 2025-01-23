import { MongoClient } from "mongodb";
import configVariable from "./config/config.js";

let collectionName = "Customers";

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(configVariable.databaseUrl);
    return {
      client,
      collection: client.db(configVariable.dbName).collection(collectionName),
    };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
