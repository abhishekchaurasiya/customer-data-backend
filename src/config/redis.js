import Redis from "ioredis";
import configVariable from "./config.js";

const redisDb = Number.isInteger(Number(configVariable.redisDatabase))
  ? Number(configVariable.redisDatabase)
  : 0; // fallback to 0 if invalid

const redisClient = new Redis(
  {
    db: redisDb,
    host: configVariable.redisHost,
    port: configVariable.redisPort,
    password: configVariable.redisPassword,
  },
  {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  }
);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (error) => {
  console.error("Error connecting to Redis", error);
});

export default redisClient;
