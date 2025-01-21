import express from "express";
import cors from "cors";
import connectDatabase from "./config/database.js";
import configVariable from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const start = async () => {
  await connectDatabase();
  try {
    await app.listen(configVariable.port, () => {
      console.log(`Server is running on port ${configVariable.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
