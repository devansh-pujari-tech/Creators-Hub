const { Pool } = require("pg");

const pool = process.env.POSTGRES_URL
  ? new Pool({ connectionString: process.env.POSTGRES_URL })
  : null;

const query = async (text, values) => {
  if (!pool) {
    const error = new Error("POSTGRES_URL is not configured");
    error.status = 503;
    throw error;
  }
  return pool.query(text, values);
};

module.exports = { query };
