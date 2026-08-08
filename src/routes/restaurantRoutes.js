const express = require("express");

const {
  createRestaurant,
  getMyRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
  deactivateRestaurant,
  getRestaurantMenu,
} = require("../controllers/restaurantController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all active restaurants
// GET /api/restaurants
router.get("/", getRestaurants);


// =====================================================
// PROTECTED OWNER ROUTES
// =====================================================

// Get logged-in owner's restaurant
// GET /api/restaurants/me
router.get(
  "/me",
  authMiddleware,
  getMyRestaurant
);

router.get(
  "/:id/menu",
  getRestaurantMenu
);

// Register restaurant
// POST /api/restaurants
router.post(
  "/",
  authMiddleware,
  createRestaurant
);


// Update logged-in owner's restaurant
// PUT /api/restaurants/me
router.put(
  "/me",
  authMiddleware,
  updateRestaurant
);


// Deactivate logged-in owner's restaurant
// PATCH /api/restaurants/me/deactivate
router.patch(
  "/me/deactivate",
  authMiddleware,
  deactivateRestaurant
);


// =====================================================
// PUBLIC RESTAURANT DETAILS
// =====================================================

// Get restaurant by ID
// GET /api/restaurants/:id
router.get(
  "/:id",
  getRestaurant
);


module.exports = router;