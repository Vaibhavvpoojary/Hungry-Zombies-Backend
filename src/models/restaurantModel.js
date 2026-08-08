const pool = require("../config/db");

const createRestaurant = async (
  ownerId,
  name,
  description,
  phone,
  email,
  address,
  city,
  imageUrl
) => {
  const result = await pool.query(
    `
    INSERT INTO restaurants
    (
      owner_id,
      name,
      description,
      phone,
      email,
      address,
      city,
      image_url
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      ownerId,
      name,
      description,
      phone,
      email,
      address,
      city,
      imageUrl,
    ]
  );

  return result.rows[0];
};

const getRestaurantByOwnerId = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM restaurants
    WHERE owner_id = $1
    `,
    [ownerId]
  );

  return result.rows[0];
};

const getRestaurantById = async (restaurantId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM restaurants
    WHERE id = $1
    `,
    [restaurantId]
  );

  return result.rows[0];
};

const pool = require("../config/db");

const findRestaurantByOwnerId = async (ownerId) => {

  const result = await pool.query(

    `

    SELECT

      id,

      owner_id,

      name,

      description,

      phone,

      email,

      address,

      city,

      image_url,

      is_active,

      created_at

    FROM restaurants

    WHERE owner_id = $1

    LIMIT 1

    `,

    [ownerId]

  );

  return result.rows[0];

};

const getActiveRestaurants = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM restaurants
    WHERE is_active = TRUE
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const updateRestaurant = async (
  restaurantId,
  name,
  description,
  phone,
  email,
  address,
  city,
  imageUrl
) => {
  const result = await pool.query(
    `
    UPDATE restaurants
    SET
      name = $1,
      description = $2,
      phone = $3,
      email = $4,
      address = $5,
      city = $6,
      image_url = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      name,
      description,
      phone,
      email,
      address,
      city,
      imageUrl,
      restaurantId,
    ]
  );

  return result.rows[0];
};

const deactivateRestaurant = async (restaurantId) => {
  const result = await pool.query(
    `
    UPDATE restaurants
    SET is_active = FALSE
    WHERE id = $1
    RETURNING *
    `,
    [restaurantId]
  );

  return result.rows[0];
};

module.exports = {
  createRestaurant,
  getRestaurantByOwnerId,
  getRestaurantById,
  getActiveRestaurants,
  updateRestaurant,
  deactivateRestaurant,
  findRestaurantByOwnerId,
};