const restaurantModel = require("../models/restaurantModel");

const normalizeField = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

// Register restaurant
const createRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const name = normalizeField(req.body.name);
    const description = normalizeField(req.body.description);
    const phone = normalizeField(req.body.phone);
    const email = normalizeField(req.body.email);
    const address = normalizeField(req.body.address);
    const city = normalizeField(req.body.city);
    const imageUrl = normalizeField(req.body.image_url);

    if (!name || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, address and city are required",
      });
    }

    const existingRestaurant =
      await restaurantModel.getRestaurantByOwnerId(ownerId);

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "You already have a restaurant registered",
      });
    }

    const restaurant = await restaurantModel.createRestaurant(
      ownerId,
      name,
      description,
      phone,
      email,
      address,
      city,
      imageUrl
    );

    return res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get logged-in owner's restaurant
const getMyRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const restaurant =
      await restaurantModel.getRestaurantByOwnerId(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get restaurant by ID
const getRestaurant = async (req, res) => {
  try {
    const restaurantId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant =
      await restaurantModel.getRestaurantById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get all active restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants =
      await restaurantModel.getActiveRestaurants();

    return res.status(200).json({
      success: true,
      restaurants,
    });
  } catch (error) {
    console.error("Get restaurants error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const existingRestaurant =
      await restaurantModel.getRestaurantByOwnerId(ownerId);

    if (!existingRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const name = normalizeField(req.body.name);
    const description = normalizeField(req.body.description);
    const phone = normalizeField(req.body.phone);
    const email = normalizeField(req.body.email);
    const address = normalizeField(req.body.address);
    const city = normalizeField(req.body.city);
    const imageUrl = normalizeField(req.body.image_url);

    if (!name || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, address and city are required",
      });
    }

    const restaurant = await restaurantModel.updateRestaurant(
      existingRestaurant.id,
      name,
      description,
      phone,
      email,
      address,
      city,
      imageUrl
    );

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Deactivate restaurant
const deactivateRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const existingRestaurant =
      await restaurantModel.getRestaurantByOwnerId(ownerId);

    if (!existingRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurantModel.deactivateRestaurant(existingRestaurant.id);

    return res.status(200).json({
      success: true,
      message: "Restaurant deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  createRestaurant,
  getMyRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
  deactivateRestaurant,
};