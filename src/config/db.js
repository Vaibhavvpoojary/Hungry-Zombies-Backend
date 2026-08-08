require("dotenv").config({ override: true });

const { Pool } = require("pg");

// If a full DATABASE_URL is provided, use it. Otherwise require the explicit
// DB_* variables. Do NOT fall back to other usernames or defaults.
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  const connectionString = databaseUrl.trim();
  console.log("ℹ️  Using DATABASE_URL for Postgres connection");
  const pool = new Pool({ connectionString });
  module.exports = pool;
  return;
}

const requiredVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
const missing = requiredVars.filter((name) => {
  const v = process.env[name];
  return v === undefined || v === null || String(v).trim() === "";
});

if (missing.length > 0) {
  console.error("Missing required environment variable(s):", missing.join(", "));
  throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
}

const dbHost = process.env.DB_HOST;
const normalizedDbHost = dbHost === "localhost" ? "127.0.0.1" : dbHost;
const dbPort = Number(process.env.DB_PORT);
if (Number.isNaN(dbPort)) {
  console.error("DB_PORT is not a valid number:", process.env.DB_PORT);
  throw new Error(`DB_PORT is not a valid number: ${process.env.DB_PORT}`);
}
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD && String(process.env.DB_PASSWORD).trim() !== ""
  ? process.env.DB_PASSWORD
  : undefined;

// Print final resolved configuration excluding password
console.log(`ℹ️  Resolved Postgres config: host="${normalizedDbHost}" port=${dbPort} user="${dbUser}" database="${dbName}"`);

const pool = new Pool({
  host: normalizedDbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

module.exports = pool;