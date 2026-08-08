const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { getCurrentUser } = require("../controllers/userController");

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;