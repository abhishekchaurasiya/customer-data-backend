import { MongoClient } from "mongodb";
import configVariable from "./config/config.js";

// const client = new MongoClient(configVariable.databaseUrl);

// await client.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to the database");
// });

// let db = client.db(configVariable.dbName);
// let Customer = db.collection("Customers");

// export default Customer;

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
