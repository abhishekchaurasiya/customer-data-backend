import { generateCacheData } from "./utils/validateUtility.js";
import getCollection from "./config/database.js";
import redisClient from "./config/redis.js";
import { ErrorHandler } from "./errorHandler.js";

let CACHE_TTL = 300;

const getCustomers = async (req, res, next) => {
  let dbClient;

  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      filterField,
      filterValue,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cacheKey = generateCacheData(req.query);
    const findCacheCustomerData = await redisClient.get(cacheKey);

    if (findCacheCustomerData) {
      return res.status(200).json(JSON.parse(findCacheCustomerData));
    }

    let { client, collection } = await getCollection();
    dbClient = client;

    const query = {};

    if (search) {
      query.$or = [
        { name_of_customer: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (filterField && filterValue) {
      // Protect against injection by validating filterField
      const validFields = [
        "name_of_customer",
        "email",
        "mobile_number",
        "created_at",
        "modified_at",
      ];
      if (validFields.includes(filterField)) {
        query[filterField] = filterValue;
      }
    }

    const [customers, total] = await Promise.all([
      collection
        .find(query)
        .sort({ s_no: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      collection.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const customerResponses = {
      metadata: {
        totalCustomers: total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage,
        hasPrevPage,
        recordsPerPage: customers.length,
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
    return next(new ErrorHandler(error, 500));
  } finally {
    if (dbClient) {
      dbClient.close();
    }
  }
};

export default getCustomers;
