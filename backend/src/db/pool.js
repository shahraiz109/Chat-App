const { Pool } = require("pg");
const { databaseUrl, dbUser, dbHost, dbName, dbPassword, dbPort } = require("../config/env");

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : new Pool({
      user: dbUser,
      host: dbHost,
      database: dbName,
      password: dbPassword,
      port: dbPort,
    });

module.exports = pool;
