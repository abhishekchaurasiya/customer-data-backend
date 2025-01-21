import express from "express";
const customerRouter = express.Router();
import { MongoClient } from "mongodb";
import configVariable from "./config/config.js";
let collectionName = "Customers";

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
    // Validate and parse pagination params
    req.query.page = parseInt(req.query.page) || 1;
    req.query.limit = parseInt(req.query.limit) || 10;

    // Validate page and limit values
    if (req.query.page < 1) req.query.page = 1;
    if (req.query.limit < 1) req.query.limit = 10;
    if (req.query.limit > 100) req.query.limit = 100;

    next();
  } catch (error) {
    next(error);
  }
};

// Build query based on search and filter parameters
const buildQuery = (search, filterField, filterValue) => {
  const query = {};

  // Add search conditions
  if (search) {
    query.$or = [
      { name_of_customer: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
    ];
  }

  // Add filter conditions
  if (filterField && filterValue) {
    // Handle different field types appropriately
    switch (filterField) {
      case "dob":
        query[filterField] = new Date(filterValue);
        break;
      case "s_no":
        query[filterField] = parseInt(filterValue);
        break;
      case "created_at":
      case "modified_at":
        query[filterField] = new Date(filterValue);
        break;
      default:
        query[filterField] = new RegExp(filterValue, "i");
    }
  }

  return query;
};

// Main customer endpoint with pagination, search, and filtering
customerRouter.get(
  "/customers",
  validateQueryParams,
  async (req, res, next) => {
    let dbClient;

    try {
      const { page, limit, search, filterField, filterValue } = req.query;
      const skip = (page - 1) * limit;

      // Connect to database
      const { client, collection } = await connectDB();
      dbClient = client;

      // Build query
      const query = buildQuery(search, filterField, filterValue);

      // Execute query with pagination
      const [customers, total] = await Promise.all([
        collection
          .find(query)
          .sort({ s_no: 1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments(query),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // Send response
      res.json({
        status: "success",
        metadata: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
          totalCustomers: customers.length,
        },
        data: customers,
        query: {
          search,
          filterField,
          filterValue,
        },
      });
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
