const fs = require("fs");
const path = require("path");
const pool = require("../db/pool");

async function initDb() {
  const schemaPath = path.join(__dirname, "../db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  await pool.query(sql);
  await pool.end();
  console.log("Database initialized.");
}

initDb().catch(async (error) => {
  console.error("Database initialization failed:", error.message);
  await pool.end();
  process.exit(1);
});
