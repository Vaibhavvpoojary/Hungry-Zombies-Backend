const pool = require("../config/db");


// =====================================================
// CREATE FOOD
// =====================================================

const createFood = async (
  categoryId,
  name,
  description,
  price,
  rating,
  isVeg,
  image
) => {

  const result = await pool.query(
    `
    INSERT INTO foods (
      category_id,
      name,
      description,
      price,
      rating,
      is_veg,
      image
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      category_id,
      name,
      description,
      price,
      rating,
      is_veg,
      image
    `,
    [
      categoryId,
      name,
      description,
      price,
      rating,
      isVeg,
      image
    ]
  );

  return result.rows[0];
};


// =====================================================
// GET FOODS BY CATEGORY
// =====================================================

const getFoodsByCategory = async (categoryId) => {

  const result = await pool.query(
    `
    SELECT
      id,
      category_id,
      name,
      description,
      price,
      rating,
      is_veg,
      image
    FROM foods
    WHERE category_id = $1
    ORDER BY id ASC
    `,
    [categoryId]
  );

  return result.rows;
};


// =====================================================
// GET FOOD BY ID
// =====================================================

const findFoodById = async (foodId) => {

  const result = await pool.query(
    `
    SELECT
      id,
      category_id,
      name,
      description,
      price,
      rating,
      is_veg,
      image
    FROM foods
    WHERE id = $1
    `,
    [foodId]
  );

  return result.rows[0];
};


// =====================================================
// GET ALL FOODS FOR A RESTAURANT
// =====================================================

const getFoodsByRestaurant = async (restaurantId) => {

  const result = await pool.query(
    `
    SELECT
      f.id,
      f.category_id,
      f.name,
      f.description,
      f.price,
      f.rating,
      f.is_veg,
      f.image,
      c.name AS category_name,
      c.restaurant_id
    FROM foods f
    INNER JOIN categories c
      ON f.category_id = c.id
    WHERE c.restaurant_id = $1
    ORDER BY f.id ASC
    `,
    [restaurantId]
  );

  return result.rows;
};


// =====================================================
// UPDATE FOOD
// =====================================================

const updateFood = async (
  foodId,
  categoryId,
  name,
  description,
  price,
  rating,
  isVeg,
  image
) => {

  const result = await pool.query(
    `
    UPDATE foods
    SET
      category_id = $1,
      name = $2,
      description = $3,
      price = $4,
      rating = $5,
      is_veg = $6,
      image = $7
    WHERE id = $8
    RETURNING
      id,
      category_id,
      name,
      description,
      price,
      rating,
      is_veg,
      image
    `,
    [
      categoryId,
      name,
      description,
      price,
      rating,
      isVeg,
      image,
      foodId
    ]
  );

  return result.rows[0];
};


// =====================================================
// DELETE FOOD
// =====================================================

const deleteFood = async (foodId) => {

  const result = await pool.query(
    `
    DELETE FROM foods
    WHERE id = $1
    RETURNING id
    `,
    [foodId]
  );

  return result.rows[0];
};

const getMenuByRestaurant = async (restaurantId) => {
  const result = await pool.query(
    `
    SELECT
      c.id AS category_id,
      c.name AS category_name,
      c.description AS category_description,
      c.image AS category_image,

      f.id AS food_id,
      f.name AS food_name,
      f.description AS food_description,
      f.price,
      f.rating,
      f.is_veg,
      f.image AS food_image

    FROM categories c

    LEFT JOIN foods f
      ON f.category_id = c.id

    WHERE c.restaurant_id = $1

    ORDER BY c.id ASC, f.id ASC
    `,
    [restaurantId]
  );

  return result.rows;
};


module.exports = {
  createFood,
  getFoodsByCategory,
  findFoodById,
  getFoodsByRestaurant,
  updateFood,
  deleteFood,
  getMenuByRestaurant,
};