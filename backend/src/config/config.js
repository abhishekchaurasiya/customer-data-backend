import dotenv from "dotenv";
dotenv.config();

const configVariable = {
  databaseUrl: process.env.MONGODB_URI,
  port: process.env.PORT,
  dbName: process.env.DB_NAME,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
};

export default configVariable;
