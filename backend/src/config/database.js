import { MongoClient } from "mongodb";
import configVariable from "./config.js";

async function getCollection() {
  const client = await MongoClient.connect(configVariable.databaseUrl);
  const db = client.db(configVariable.dbName);
  return {
    client,
    collection: db.collection(configVariable.collectionName),
  };
}

export default getCollection;
