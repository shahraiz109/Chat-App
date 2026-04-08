const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:8081",
  databaseUrl: process.env.DATABASE_URL,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
