const offerDealModel = require("../models/offerDealModel");
const restaurantModel = require("../models/restaurantModel");

const normalizeField = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const parseNullableNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const parseNullableDate = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};


// =====================================================
// CREATE OFFER / DEAL
// POST /api/offer-deals
// =====================================================

const createOfferDeal = async (req, res) => {
  try {
    const userId = req.user.userId;

    const title = normalizeField(req.body.title);
    const description = normalizeField(req.body.description);
    const type = normalizeField(req.body.type).toLowerCase();
    const discountType =
      normalizeField(req.body.discount_type).toLowerCase() || "none";

    const discountValue = parseNullableNumber(
      req.body.discount_value
    );

    const imageUrl = normalizeField(req.body.image_url);

    const startDate = parseNullableDate(
      req.body.start_date
    );

    const endDate = parseNullableDate(
      req.body.end_date
    );


    // Required fields

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }


    // Validate type

    if (!["offer", "deal"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either offer or deal",
      });
    }


    // Validate discount type

    if (
      !["percentage", "fixed", "none"].includes(
        discountType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Discount type must be percentage, fixed or none",
      });
    }


    // Validate discount value

    if (
      discountType !== "none" &&
      (discountValue === null || discountValue < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid discount value is required",
      });
    }


    // Percentage cannot exceed 100

    if (
      discountType === "percentage" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100",
      });
    }


    // Validate dates

    if (
      req.body.start_date &&
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    if (
      req.body.end_date &&
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date",
      });
    }


    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Start date cannot be after end date",
      });
    }


    // Find restaurant owned by logged-in user

    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "Restaurant not found for this user",
      });
    }


    // Create offer/deal

    const offerDeal =
      await offerDealModel.createOfferDeal(
        restaurant.id,
        title,
        description,
        type,
        discountType,
        discountValue,
        imageUrl,
        startDate,
        endDate
      );


    return res.status(201).json({
      success: true,
      message:
        "Offer/deal created successfully",
      offer_deal: offerDeal,
    });

  } catch (error) {

    console.error(
      "Create offer/deal error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET MY RESTAURANT OFFER / DEALS
// GET /api/offer-deals/owner/me
// =====================================================

const getMyOfferDeals = async (req, res) => {
  try {

    const userId = req.user.userId;

    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "Restaurant not found for this user",
      });
    }


    const offerDeals =
      await offerDealModel.getOfferDealsByRestaurant(
        restaurant.id
      );


    return res.status(200).json({
      success: true,
      restaurant_id: restaurant.id,
      offer_deals: offerDeals,
    });

  } catch (error) {

    console.error(
      "Get my offer/deals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET ACTIVE OFFER / DEALS FOR RESTAURANT
// GET /api/offer-deals/restaurant/:restaurantId
// =====================================================

const getRestaurantOfferDeals = async (req, res) => {
  try {

    const restaurantId =
      Number.parseInt(
        req.params.restaurantId,
        10
      );


    if (
      !Number.isInteger(restaurantId) ||
      restaurantId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid restaurant ID",
      });
    }


    const restaurant =
      await restaurantModel.getRestaurantById(
        restaurantId
      );


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "Restaurant not found",
      });
    }


    const offerDeals =
      await offerDealModel
        .getActiveOfferDealsByRestaurant(
          restaurantId
        );


    return res.status(200).json({
      success: true,
      restaurant_id: restaurantId,
      offer_deals: offerDeals,
    });

  } catch (error) {

    console.error(
      "Get restaurant offer/deals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET ALL ACTIVE OFFER / DEALS FROM ALL RESTAURANTS
// GET /api/offer-deals
// =====================================================

const getAllActiveOfferDeals = async (req, res) => {
  try {
    const offerDeals = await offerDealModel.getAllActiveOfferDeals();

    return res.status(200).json({
      success: true,
      offer_deals: offerDeals,
    });
  } catch (error) {
    console.error("Get all active offer/deals error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// GET OFFER / DEAL BY ID
// GET /api/offer-deals/:id
// =====================================================

const getOfferDealById = async (req, res) => {
  try {

    const offerDealId =
      Number.parseInt(
        req.params.id,
        10
      );


    if (
      !Number.isInteger(offerDealId) ||
      offerDealId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid offer/deal ID",
      });
    }


    const offerDeal =
      await offerDealModel.findOfferDealById(
        offerDealId
      );


    if (!offerDeal) {
      return res.status(404).json({
        success: false,
        message:
          "Offer/deal not found",
      });
    }


    return res.status(200).json({
      success: true,
      offer_deal: offerDeal,
    });

  } catch (error) {

    console.error(
      "Get offer/deal error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// UPDATE OFFER / DEAL
// PUT /api/offer-deals/owner/:id
// =====================================================

const updateOfferDeal = async (req, res) => {
  try {

    const userId = req.user.userId;

    const offerDealId =
      Number.parseInt(
        req.params.id,
        10
      );


    if (
      !Number.isInteger(offerDealId) ||
      offerDealId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid offer/deal ID",
      });
    }


    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "Restaurant not found",
      });
    }


    const existingOfferDeal =
      await offerDealModel.findOfferDealById(
        offerDealId
      );


    if (!existingOfferDeal) {
      return res.status(404).json({
        success: false,
        message:
          "Offer/deal not found",
      });
    }


    // Ownership check

    if (
      existingOfferDeal.restaurant_id !==
      restaurant.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to modify this offer/deal",
      });
    }


    const title = normalizeField(req.body.title);
    const description =
      normalizeField(req.body.description);

    const type =
      normalizeField(req.body.type).toLowerCase();

    const discountType =
      normalizeField(
        req.body.discount_type
      ).toLowerCase() || "none";

    const discountValue =
      parseNullableNumber(
        req.body.discount_value
      );

    const imageUrl =
      normalizeField(
        req.body.image_url
      );

    const startDate =
      parseNullableDate(
        req.body.start_date
      );

    const endDate =
      parseNullableDate(
        req.body.end_date
      );


    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message:
          "Title and type are required",
      });
    }


    if (
      !["offer", "deal"].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Type must be either offer or deal",
      });
    }


    if (
      !["percentage", "fixed", "none"].includes(
        discountType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid discount type",
      });
    }


    if (
      discountType !== "none" &&
      (discountValue === null ||
        discountValue < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid discount value is required",
      });
    }


    if (
      discountType === "percentage" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100",
      });
    }


    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Start date cannot be after end date",
      });
    }


    const updatedOfferDeal =
      await offerDealModel.updateOfferDeal(
        offerDealId,
        title,
        description,
        type,
        discountType,
        discountValue,
        imageUrl,
        startDate,
        endDate
      );


    return res.status(200).json({
      success: true,
      message:
        "Offer/deal updated successfully",
      offer_deal: updatedOfferDeal,
    });

  } catch (error) {

    console.error(
      "Update offer/deal error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// DEACTIVATE OFFER / DEAL
// PATCH /api/offer-deals/owner/:id/deactivate
// =====================================================

const deactivateOfferDeal = async (req, res) => {
  try {

    const userId = req.user.userId;

    const offerDealId =
      Number.parseInt(
        req.params.id,
        10
      );


    if (
      !Number.isInteger(offerDealId) ||
      offerDealId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid offer/deal ID",
      });
    }


    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "Restaurant not found",
      });
    }


    const existingOfferDeal =
      await offerDealModel.findOfferDealById(
        offerDealId
      );


    if (!existingOfferDeal) {
      return res.status(404).json({
        success: false,
        message:
          "Offer/deal not found",
      });
    }


    if (
      existingOfferDeal.restaurant_id !==
      restaurant.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to deactivate this offer/deal",
      });
    }


    await offerDealModel.deactivateOfferDeal(
      offerDealId
    );


    return res.status(200).json({
      success: true,
      message:
        "Offer/deal deactivated successfully",
    });

  } catch (error) {

    console.error(
      "Deactivate offer/deal error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// DELETE OFFER / DEAL
// DELETE /api/offer-deals/owner/:id
// =====================================================

const deleteOfferDeal = async (req, res) => {
  try {

    const userId = req.user.userId;

    const offerDealId =
      Number.parseInt(
        req.params.id,
        10
      );


    if (
      !Number.isInteger(offerDealId) ||
      offerDealId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid offer/deal ID",
      });
    }


    const restaurant =
      await restaurantModel.findRestaurantByOwnerId(
        userId
      );


    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "Restaurant not found",
      });
    }


    const existingOfferDeal =
      await offerDealModel.findOfferDealById(
        offerDealId
      );


    if (!existingOfferDeal) {
      return res.status(404).json({
        success: false,
        message:
          "Offer/deal not found",
      });
    }


    if (
      existingOfferDeal.restaurant_id !==
      restaurant.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this offer/deal",
      });
    }


    await offerDealModel.deleteOfferDeal(
      offerDealId
    );


    return res.status(200).json({
      success: true,
      message:
        "Offer/deal deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete offer/deal error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  createOfferDeal,
  getMyOfferDeals,
  getRestaurantOfferDeals,
  getAllActiveOfferDeals,
  getOfferDealById,
  updateOfferDeal,
  deactivateOfferDeal,
  deleteOfferDeal,
};
