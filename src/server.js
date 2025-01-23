import express from "express";
import cors from "cors";
import morgan from "morgan";
import configVariable from "./config/config.js";
import customerRouter from "./customerRoutes.js";
import { globalErrorHandler } from "./errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use("/api", customerRouter);

app.use(globalErrorHandler);

const start = async () => {
  // await getCollection();

  try {
    await app.listen(configVariable.port, () => {
      console.log(`Server is running on port ${configVariable.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
