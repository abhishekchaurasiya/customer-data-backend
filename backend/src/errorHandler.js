const globalErrorHandler = async function (err, req, res, next) {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ error: err.message });
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ErrorHandler, globalErrorHandler };
