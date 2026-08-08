const categoryModel = require("../models/categoryModel");
const restaurantModel = require("../models/restaurantModel");

const normalizeField = (value) => {
  return typeof value === "string" ? value.trim() : "";
};


// =====================================================
// CREATE CATEGORY
// POST /api/categories
// =====================================================

const createCategory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const name = normalizeField(req.body.name);
    const description = normalizeField(req.body.description);
    const image = normalizeField(req.body.image);

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Find restaurant owned by logged-in user
    const restaurant = await restaurantModel.findRestaurantByOwnerId(userId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }

    // Create category
    const category = await categoryModel.createCategory(
      restaurant.id,
      name,
      description,
      image
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    console.error("Create category error:", error);

    // Duplicate category for same restaurant
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category already exists for this restaurant",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET MY RESTAURANT CATEGORIES
// GET /api/categories
// =====================================================

const getMyCategories = async (req, res) => {
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

    const categories =
      await categoryModel.getCategoriesByRestaurant(restaurant.id);

    return res.status(200).json({
      success: true,
      restaurant_id: restaurant.id,
      categories,
    });

  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET CATEGORY BY ID
// GET /api/categories/:id
// =====================================================

const getCategoryById = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category =
      await categoryModel.findCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });

  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// UPDATE CATEGORY
// PUT /api/categories/:id
// =====================================================

const updateCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const name = normalizeField(req.body.name);
    const description = normalizeField(req.body.description);
    const image = normalizeField(req.body.image);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Find restaurant owned by current user
    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(userId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }

    // Find category
    const existingCategory =
      await categoryModel.findCategoryById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Ownership check
    if (existingCategory.restaurant_id !== restaurant.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this category",
      });
    }

    const category = await categoryModel.updateCategory(
      categoryId,
      name,
      description,
      image
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category already exists for this restaurant",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// DELETE CATEGORY
// DELETE /api/categories/:id
// =====================================================

const deleteCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(userId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this user",
      });
    }

    const existingCategory =
      await categoryModel.findCategoryById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Ownership check
    if (existingCategory.restaurant_id !== restaurant.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this category",
      });
    }

    await categoryModel.deleteCategory(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  createCategory,
  getMyCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};