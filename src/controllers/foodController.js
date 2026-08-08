const foodModel = require("../models/foodModel");
const categoryModel = require("../models/categoryModel");
const restaurantModel = require("../models/restaurantModel");


// =====================================================
// HELPERS
// =====================================================

const normalizeField = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const getPositiveNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return number;
};


// =====================================================
// CREATE FOOD
// POST /api/foods
// =====================================================

const createFood = async (req, res) => {
  try {

    const userId = req.user.userId;

    const categoryId = Number(req.body.category_id);

    const name = normalizeField(req.body.name);
    const description = normalizeField(req.body.description);
    const image = normalizeField(req.body.image);

    const price = getPositiveNumber(req.body.price);

    const rating =
      req.body.rating === undefined
        ? 0
        : Number(req.body.rating);

    const isVeg =
      req.body.is_veg === undefined
        ? true
        : Boolean(req.body.is_veg);


    // -------------------------------------------------
    // Validate category
    // -------------------------------------------------

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Valid category_id is required",
      });
    }


    // -------------------------------------------------
    // Validate name
    // -------------------------------------------------

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }


    // -------------------------------------------------
    // Validate price
    // -------------------------------------------------

    if (price === null) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }


    // -------------------------------------------------
    // Validate rating
    // -------------------------------------------------

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }


    // -------------------------------------------------
    // Find logged-in user's restaurant
    // -------------------------------------------------

    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(userId);


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }


    // -------------------------------------------------
    // Find category
    // -------------------------------------------------

    const category =
      await categoryModel.findCategoryById(categoryId);


    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


    // -------------------------------------------------
    // Ownership validation
    // -------------------------------------------------

    if (category.restaurant_id !== restaurant.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot add food to another restaurant's category",
      });
    }


    // -------------------------------------------------
    // Create food
    // -------------------------------------------------

    const food = await foodModel.createFood(
      categoryId,
      name,
      description,
      price,
      rating,
      isVeg,
      image
    );


    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      food,
    });

  } catch (error) {

    console.error("Create food error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET MY RESTAURANT FOODS
// GET /api/foods
// =====================================================

const getMyFoods = async (req, res) => {

  try {

    const userId = req.user.userId;


    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(userId);


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }


    const foods =
      await foodModel.getFoodsByRestaurant(
        restaurant.id
      );


    return res.status(200).json({
      success: true,
      restaurant_id: restaurant.id,
      foods,
    });

  } catch (error) {

    console.error("Get foods error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET FOODS BY CATEGORY
// GET /api/foods/category/:categoryId
// =====================================================

const getFoodsByCategory = async (req, res) => {

  try {

    const categoryId =
      Number(req.params.categoryId);


    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }


    const category =
      await categoryModel.findCategoryById(
        categoryId
      );


    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


    const foods =
      await foodModel.getFoodsByCategory(
        categoryId
      );


    return res.status(200).json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
      },
      foods,
    });

  } catch (error) {

    console.error(
      "Get foods by category error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET FOOD BY ID
// GET /api/foods/:id
// =====================================================

const getFoodById = async (req, res) => {

  try {

    const foodId =
      Number(req.params.id);


    if (!Number.isInteger(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }


    const food =
      await foodModel.findFoodById(foodId);


    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }


    return res.status(200).json({
      success: true,
      food,
    });

  } catch (error) {

    console.error(
      "Get food error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// UPDATE FOOD
// PUT /api/foods/:id
// =====================================================

const updateFood = async (req, res) => {

  try {

    const userId = req.user.userId;

    const foodId =
      Number(req.params.id);

    const categoryId =
      Number(req.body.category_id);

    const name =
      normalizeField(req.body.name);

    const description =
      normalizeField(req.body.description);

    const image =
      normalizeField(req.body.image);

    const price =
      getPositiveNumber(req.body.price);

    const rating =
      req.body.rating === undefined
        ? 0
        : Number(req.body.rating);

    const isVeg =
      req.body.is_veg === undefined
        ? true
        : Boolean(req.body.is_veg);


    if (!Number.isInteger(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }


    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Valid category_id is required",
      });
    }


    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }


    if (price === null) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }


    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }


    // -------------------------------------------------
    // Find restaurant
    // -------------------------------------------------

    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }


    // -------------------------------------------------
    // Find existing food
    // -------------------------------------------------

    const existingFood =
      await foodModel.findFoodById(foodId);


    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }


    // -------------------------------------------------
    // Check existing food ownership
    // -------------------------------------------------

    const existingCategory =
      await categoryModel.findCategoryById(
        existingFood.category_id
      );


    if (
      !existingCategory ||
      existingCategory.restaurant_id !== restaurant.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this food",
      });
    }


    // -------------------------------------------------
    // Check new category ownership
    // -------------------------------------------------

    const newCategory =
      await categoryModel.findCategoryById(
        categoryId
      );


    if (!newCategory) {
      return res.status(404).json({
        success: false,
        message: "New category not found",
      });
    }


    if (
      newCategory.restaurant_id !== restaurant.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot move food to another restaurant's category",
      });
    }


    // -------------------------------------------------
    // Update food
    // -------------------------------------------------

    const food =
      await foodModel.updateFood(
        foodId,
        categoryId,
        name,
        description,
        price,
        rating,
        isVeg,
        image
      );


    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food,
    });

  } catch (error) {

    console.error(
      "Update food error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// DELETE FOOD
// DELETE /api/foods/:id
// =====================================================

const deleteFood = async (req, res) => {

  try {

    const userId = req.user.userId;

    const foodId =
      Number(req.params.id);


    if (!Number.isInteger(foodId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food ID",
      });
    }


    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }


    const food =
      await foodModel.findFoodById(foodId);


    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }


    const category =
      await categoryModel.findCategoryById(
        food.category_id
      );


    if (
      !category ||
      category.restaurant_id !== restaurant.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this food",
      });
    }


    await foodModel.deleteFood(foodId);


    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete food error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  createFood,
  getMyFoods,
  getFoodsByCategory,
  getFoodById,
  updateFood,
  deleteFood,
};