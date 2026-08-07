const pool = require("../config/db");

const createUser = async (name, email, phone, password) => {
  const result = await pool.query(
    `
    INSERT INTO users (name, email, phone, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, phone, created_at
    `,
    [name, email, phone, password]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE phone = $1
    `,
    [phone]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
};
