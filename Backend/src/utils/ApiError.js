class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stacked = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.data = null),
      (this.message = message),
      (this.success = false),
      (this.errors = errors);
    stacked
      ? (this.stack = stacked)
      : Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
