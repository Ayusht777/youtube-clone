const config = {
  port: process.env.PORT,
  mongo_db_uri: process.env.MONGODB_URI,
  frontend_domain: process.env.CORS_ORIGIN,
  cloud_api_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
};

Object.freeze(config);

export { config };
