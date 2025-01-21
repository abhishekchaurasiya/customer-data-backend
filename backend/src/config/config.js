import dotenv from "dotenv";
dotenv.config();

const configVariable = {
  databaseUrl: process.env.MONGODB_URI,
  port: process.env.PORT,
};

export default configVariable;
