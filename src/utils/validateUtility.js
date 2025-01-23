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

  const validateMobile = (value) => {
    const pattern =
      /^(?:\+\d{1,3}[-.\s]?)?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;
    if (filterField === "mobile_number" && !pattern.test(value)) return false;
    return true;
  };

  if (filterField === "mobile_number" && !validateMobile(filterValue)) {
    return next(
      new ErrorHandler(`Invalid filter value for ${filterField} field`, 400)
    );
  }

  const validateValue = (value) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (filterField === "email" && !pattern.test(value)) return false;
    return true;
  };

  if (filterField && !validateValue(filterValue)) {
    return next(
      new ErrorHandler("Invalid filter value for specified field", 400)
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
