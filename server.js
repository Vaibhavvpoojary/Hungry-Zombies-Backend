require("dotenv").config({ override: true });

const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 3000;

pool.query("SELECT 1")
  .then(() => {
    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err && err.stack ? err.stack : err);
    process.exit(1);
  });