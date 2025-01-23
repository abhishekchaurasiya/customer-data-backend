import { faker } from "@faker-js/faker";
import { MongoClient } from "mongodb";
import { performance } from "perf_hooks";
import "dotenv/config";

const CONFIG = {
  url: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
  collectionName: process.env.COLLECTION,
  batchSize: 1000,
  totalRecords: 2000000,
};

const generateIndianPhoneNumber = () => {
  const firstDigit = faker.helpers.arrayElement(["6", "7", "8", "9"]);
  const remainingDigits = faker.string.numeric(9);
  return `${firstDigit}${remainingDigits}`;
};

async function createIndexes(collection) {
  await Promise.all([
    collection.createIndex({ s_no: 1 }, { unique: true }),
    collection.createIndex({
      email: "text",
      mobile_number: "text",
      name_of_customer: "text",
    }),
    collection.createIndex({ created_at: 1 }),
    collection.createIndex({ modified_at: 1 }),
  ]);
  console.log("Indexes created successfully");
}

async function generateAndInsertData() {
  const startTime = performance.now();
  let recordsCreated = 0;

  try {
    const client = await MongoClient.connect(CONFIG.url);
    console.log("Connected to MongoDB successfully");

    const db = client.db(CONFIG.dbName);
    const collection = db.collection(CONFIG.collectionName);

    await createIndexes(collection);

    // Generate and insert data in batches
    for (let i = 0; i < CONFIG.totalRecords; i += CONFIG.batchSize) {
      const batch = [];

      for (
        let j = 0;
        j < CONFIG.batchSize && i + j < CONFIG.totalRecords;
        j++
      ) {
        const currentDate = new Date();
        const user = {
          s_no: i + j + 1,
          name_of_customer: `${faker.person.firstName()} ${faker.person.lastName()}`,
          email: faker.internet.email(),
          mobile_number: generateIndianPhoneNumber(),
          dob: faker.date.birthdate(),
          created_at: faker.date.recent(),
          modified_at: currentDate,
        };
        batch.push(user);
      }

      await collection.insertMany(batch);
      recordsCreated += batch.length;

      // Log progress
      if (recordsCreated % 100000 === 0) {
        const currentTime = performance.now();
        const timeElapsed = (currentTime - startTime) / 1000;
        const recordsPerSecond = recordsCreated / timeElapsed;
        console.log(
          `Progress: ${recordsCreated.toLocaleString()} records created`
        );
        console.log(`Speed: ${Math.round(recordsPerSecond)} records/second`);
      }
    }

    const endTime = performance.now();
    const totalTimeInSeconds = (endTime - startTime) / 1000;

    console.log("\nOperation completed successfully!");
    console.log(`Total records created: ${recordsCreated.toLocaleString()}`);
    console.log(`Total time taken: ${totalTimeInSeconds.toFixed(2)} seconds`);
    console.log(
      `Average speed: ${Math.round(
        recordsCreated / totalTimeInSeconds
      )} records/second`
    );

    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
generateAndInsertData();
