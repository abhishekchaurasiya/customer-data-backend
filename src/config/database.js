import { MongoClient } from "mongodb";
import configVariable from "./config.js";

async function getCollection() {
  const client = await MongoClient.connect(configVariable.databaseUrl, {
    writeConcern: { w: 1 },
  });
  const db = client.db(configVariable.dbName);
  return {
    client,
    collection: db.collection(configVariable.collectionName),
  };
}

export default getCollection;
