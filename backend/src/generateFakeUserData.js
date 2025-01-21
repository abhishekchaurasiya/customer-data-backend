import { faker } from "@faker-js/faker";
import { MongoClient } from "mongodb";
import { performance } from "perf_hooks";

const url =
  "mongodb+srv://abhichek2580:T53dRWbgSnqVEjoP@dbcluster.gqsm2.mongodb.net/customerdata";
const dbName = "customerdata";
const collectionName = "Customers";

const BATCH_SIZE = 1000;
const TOTAL_RECORDS = 2000000;

const generateIndianPhoneNumber = () => {
  const firstDigit = faker.helpers.arrayElement(["6", "7", "8", "9"]);
  const remainingDigits = faker.string.numeric(9);
  return `${firstDigit}${remainingDigits}`;
};

async function generateAndInsertData() {
  const startTime = performance.now();
  let recordsCreated = 0;

  try {
    const client = await MongoClient.connect(url);
    console.log("Connected to MongoDB successfully");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.createIndex({ s_no: 1 }, { unique: true });
    await collection.createIndex({ email: 1 });
    await collection.createIndex({ mobile_number: 1 });

    // Generate and insert data in batches
    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
      const batch = [];

      for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_RECORDS; j++) {
        const currentDate = new Date();
        const user = {
          s_no: i + j + 1,
          name_of_customer: faker.internet.username(),
          email: faker.internet.email(),
          mobile_number: generateIndianPhoneNumber(),
          dob: faker.date.birthdate(),
          created_at: currentDate,
          modified_at: currentDate,
        };
        batch.push(user);
      }

      await collection.insertMany(batch);
      recordsCreated += batch.length;

      // Log progress
      //   if (recordsCreated % 100000 === 0) {
      //     const currentTime = performance.now();
      //     const timeElapsed = (currentTime - startTime) / 1000;
      //     const recordsPerSecond = recordsCreated / timeElapsed;
      //     console.log(
      //       `Progress: ${recordsCreated.toLocaleString()} records created`
      //     );
      //     console.log(`Speed: ${Math.round(recordsPerSecond)} records/second`);
      //   }
    }

    // const endTime = performance.now();
    // const totalTimeInSeconds = (endTime - startTime) / 1000;

    // console.log("\nOperation completed successfully!");
    // console.log(`Total records created: ${recordsCreated.toLocaleString()}`);
    // console.log(`Total time taken: ${totalTimeInSeconds.toFixed(2)} seconds`);
    // console.log(
    //   `Average speed: ${Math.round(
    //     recordsCreated / totalTimeInSeconds
    //   )} records/second`
    // );

    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
generateAndInsertData();
