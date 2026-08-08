const express = require("express");

const {
  createRestaurant,
  getMyRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
  deactivateRestaurant,
} = require("../controllers/restaurantController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Public routes

// Get all active restaurants
router.get("/", getRestaurants);

// Get restaurant by ID
router.get("/:id", getRestaurant);


// Protected routes

// Register restaurant
router.post(
  "/",
  authMiddleware,
  createRestaurant
);

// Get logged-in owner's restaurant
router.get(
  "/owner/me",
  authMiddleware,
  getMyRestaurant
);

// Update logged-in owner's restaurant
router.put(
  "/owner/me",
  authMiddleware,
  updateRestaurant
);

// Deactivate logged-in owner's restaurant
router.patch(
  "/owner/me/deactivate",
  authMiddleware,
  deactivateRestaurant
);


module.exports = router;