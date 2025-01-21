const errorHandler = (error, req, res, next) => {
  let statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: false,
    message: error.message || "Internal server error",
  });
};

export default errorHandler;
