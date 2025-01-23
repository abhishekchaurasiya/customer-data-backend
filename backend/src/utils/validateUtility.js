import { ErrorHandler } from "../errorHandler.js";

// Query validation
export const validateQueryParams = (req, res, next) => {
  const { page, limit, filterField, filterValue } = req.query;

  if ((page && isNaN(page)) || page < 1) {
    return next(new ErrorHandler("Invalid page parameter", 400));
  }

  if ((limit && isNaN(limit)) || limit < 1) {
    return next(new ErrorHandler("Invalid limit parameter", 400));
  }

  if (filterField && !filterValue) {
    return next(
      new ErrorHandler("Filter field and value must be provided", 400)
    );
  }

  next();
};

// generate indian format phone number
export const generateCacheData = (query) => {
  const { page, limit, search, filterField, filterValue } = query;
  return `customers:page${page},limit${limit},search:${
    search || ""
  },filterField:${filterField || ""},filterValue:${filterValue || ""}`;
};
