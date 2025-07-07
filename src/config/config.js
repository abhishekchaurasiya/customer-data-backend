import dotenv from "dotenv";
dotenv.config();

const configVariable = {
  databaseUrl: process.env.MONGODB_URI,
  port: process.env.PORT,
  dbName: process.env.DB_NAME,
  collectionName: process.env.COLLECTION,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  redisDatabase: process.env.REDIS_DATABASE,
  client_url: process.env.FRONTEND_URL,
  client_web_url: process.env.FRONTEND_WEB_URL,
};

export default configVariable;
