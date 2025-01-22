import express from "express";
import cors from "cors";
// import connectDatabase from "./config/database.js";
import configVariable from "./config/config.js";
import customerRouter from "./customerRoutes.js";
import errorHandler from "./errorHandler.js";

// Connect to MongoDB
// const client = new MongoClient(configVariable.databaseUrl);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use("/api", customerRouter);

app.use(errorHandler);

const start = async () => {
  //   await connectDatabase();

  try {
    await app.listen(configVariable.port, () => {
      console.log(`Server is running on port ${configVariable.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
