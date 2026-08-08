const express = require("express");

const {
  createFood,
  getMyFoods,
  getFoodsByCategory,
  getFoodById,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// RESTAURANT OWNER ROUTES
// =====================================================

// Create food
router.post(
  "/",
  authMiddleware,
  createFood
);


// Get all foods belonging to logged-in restaurant
router.get(
  "/",
  authMiddleware,
  getMyFoods
);


// Update food
router.put(
  "/:id",
  authMiddleware,
  updateFood
);


// Delete food
router.delete(
  "/:id",
  authMiddleware,
  deleteFood
);


// =====================================================
// CUSTOMER / PUBLIC ROUTES
// =====================================================

// Get foods by category
router.get(
  "/category/:categoryId",
  getFoodsByCategory
);


// Get individual food
router.get(
  "/:id",
  getFoodById
);


module.exports = router;