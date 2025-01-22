import express, { json, query, response } from "express";
import { MongoClient } from "mongodb";
import configVariable from "./config/config.js";
import redisClient from "./config/redis.js";

const customerRouter = express.Router();

let collectionName = "Customers";
const CACHE_TTL = 300;

// const cacheKey = (req) => {
//   const { page, limit, search, filterField, filterValue } = req.query;
//   return `customers:page:${page},limit:${limit},search:${search},filterField:${filterField},filterValue:${filterValue}`;
// };
const connectDB = async () => {
  try {
    const client = await MongoClient.connect(configVariable.databaseUrl);
    return {
      client,
      collection: client.db(configVariable.dbName).collection(collectionName),
    };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
};

const validateQueryParams = (req, res, next) => {
  try {
    req.query.page = parseInt(req.query.page) || 1;
    req.query.limit = parseInt(req.query.limit) || 10;

    if (req.query.page < 1) req.query.page = 1;
    if (req.query.limit < 1) req.query.limit = 10;
    if (req.query.limit > 100) req.query.limit = 100;

    next();
  } catch (error) {
    next(error);
  }
};

const generateCacheData = (query) => {
  return `customers:${JSON.stringify(query)}`;
};

customerRouter.get(
  "/customers",
  validateQueryParams,
  async (req, res, next) => {
    let dbClient;

    try {
      const { page, limit, search, filterField, filterValue } = req.query;

      const skip = (page - 1) * limit;

      const cacheKey = generateCacheData(req.query);
      console.log(cacheKey);

      const findCacheCustomerData = await redisClient.get(cacheKey);

      // console.log(JSON.parse(findCacheCustomerData));

      if (findCacheCustomerData) {
        return res.json(JSON.parse(findCacheCustomerData));
      }

      const { client, collection } = await connectDB();
      dbClient = client;

      const query = {};

      if (search) {
        // Create compound index for search fields
        await collection.createIndex({
          email: "text",
          mobile_number: "text",
        });

        query.$or = [
          { name_of_customer: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Add filter conditions
      if (filterField && filterValue) {
        // Handle different field types appropriately
        switch (filterField) {
          case "dob":
          case "created_at":
          case "modified_at":
            query[filterField] = new Date(filterValue);
            break;
          case "s_no":
            query[filterField] = parseInt(filterValue);
            break;
          default:
            query[filterField] = new RegExp(filterValue, "i");
        }
      }

      const customers = await collection
        .find(query)
        .sort({ s_no: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await collection.countDocuments(query);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      const customerResponses = {
        status: "success",
        metadata: {
          totalCustomers: total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
          singlePageCustomer: customers.length,
        },
        data: customers,
        query: {
          search,
          filterField,
          filterValue,
        },
      };

      // Store in cache
      await redisClient.setex(
        cacheKey,
        CACHE_TTL,
        JSON.stringify(customerResponses)
      );

      return res.status(200).json(customerResponses);
    } catch (error) {
      next(error);
    } finally {
      if (dbClient) {
        await dbClient.close();
      }
    }
  }
);

export default customerRouter;
