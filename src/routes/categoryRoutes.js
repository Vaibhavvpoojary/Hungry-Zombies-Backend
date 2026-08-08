const express = require("express");

const {
  createCategory,
  getMyCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Create category
router.post(
  "/",
  authMiddleware,
  createCategory
);


// Get all categories belonging to logged-in user's restaurant
router.get(
  "/",
  authMiddleware,
  getMyCategories
);


// Get category by ID
router.get(
  "/:id",
  authMiddleware,
  getCategoryById
);


// Update category
router.put(
  "/:id",
  authMiddleware,
  updateCategory
);


// Delete category
router.delete(
  "/:id",
  authMiddleware,
  deleteCategory
);


module.exports = router;