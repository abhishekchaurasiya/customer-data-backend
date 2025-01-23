import Redis from "ioredis";
import configVariable from "./config.js";

const redisClient = new Redis(
  {
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
