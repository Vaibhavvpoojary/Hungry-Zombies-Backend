const pool = require("../config/db");

const createCategory = async (
  restaurantId,
  name,
  description,
  image
) => {
  const result = await pool.query(
    `
    INSERT INTO categories (
      restaurant_id,
      name,
      description,
      image
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      restaurant_id,
      name,
      description,
      image
    `,
    [
      restaurantId,
      name,
      description,
      image,
    ]
  );

  return result.rows[0];
};


const getCategoriesByRestaurant = async (restaurantId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      restaurant_id,
      name,
      description,
      image
    FROM categories
    WHERE restaurant_id = $1
    ORDER BY id ASC
    `,
    [restaurantId]
  );

  return result.rows;
};


const findCategoryById = async (categoryId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      restaurant_id,
      name,
      description,
      image
    FROM categories
    WHERE id = $1
    `,
    [categoryId]
  );

  return result.rows[0];
};


const updateCategory = async (
  categoryId,
  name,
  description,
  image
) => {
  const result = await pool.query(
    `
    UPDATE categories
    SET
      name = $1,
      description = $2,
      image = $3
    WHERE id = $4
    RETURNING
      id,
      restaurant_id,
      name,
      description,
      image
    `,
    [
      name,
      description,
      image,
      categoryId,
    ]
  );

  return result.rows[0];
};


const deleteCategory = async (categoryId) => {
  const result = await pool.query(
    `
    DELETE FROM categories
    WHERE id = $1
    RETURNING id
    `,
    [categoryId]
  );

  return result.rows[0];
};


module.exports = {
  createCategory,
  getCategoriesByRestaurant,
  findCategoryById,
  updateCategory,
  deleteCategory,
};