const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Default to 500 Internal Server Error if statusCode is not set
  if (!statusCode) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  // Send a structured JSON response
  return res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    errors: err.errors || [], // Include additional error details if available
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
