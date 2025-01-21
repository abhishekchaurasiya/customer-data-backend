import mongoose from "mongoose";
import configVariable from "./config.js";

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(configVariable.databaseUrl);
    console.log(
      `Database connected successfully at ${connect.connection.port}`
    );
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

export default connectDatabase;
