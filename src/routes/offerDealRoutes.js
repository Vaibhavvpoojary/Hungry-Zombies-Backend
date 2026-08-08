const express = require("express");

const {
  createOfferDeal,
  getMyOfferDeals,
  getRestaurantOfferDeals,
  getAllActiveOfferDeals,
  getOfferDealById,
  updateOfferDeal,
  deactivateOfferDeal,
  deleteOfferDeal,
} = require("../controllers/offerDealController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// PROTECTED OWNER ROUTES
// =====================================================

router.get(
  "/owner/me",
  authMiddleware,
  getMyOfferDeals
);

router.post(
  "/",
  authMiddleware,
  createOfferDeal
);

router.put(
  "/owner/:id",
  authMiddleware,
  updateOfferDeal
);

router.patch(
  "/owner/:id/deactivate",
  authMiddleware,
  deactivateOfferDeal
);

router.delete(
  "/owner/:id",
  authMiddleware,
  deleteOfferDeal
);


// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all active offers/deals from all restaurants
router.get(
  "/",
  getAllActiveOfferDeals
);

// Get active offers/deals for a restaurant
router.get(
  "/restaurant/:restaurantId",
  getRestaurantOfferDeals
);

// Get one offer/deal
router.get(
  "/:id",
  getOfferDealById
);


module.exports = router;