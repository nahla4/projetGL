import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Ensure env vars are loaded (only if not already loaded)
if (!process.env.DB_USER) {
  dotenv.config({ override: true });
}

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars);
  console.error("Please check your .env file");
}

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "projetgl",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
db.getConnection()
  .then((connection) => {
    console.log("✓ Database connection pool created successfully");
    connection.release();
  })
  .catch((error) => {
    console.error("✗ Database connection pool failed:", error.message);
    console.error("DB_HOST:", process.env.DB_HOST);
    console.error("DB_USER:", process.env.DB_USER);
    console.error("DB_NAME:", process.env.DB_NAME);
  });

export default db;
