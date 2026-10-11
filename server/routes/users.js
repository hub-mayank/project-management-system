const express = require("express");
const User = require("../models/User");
const { authenticateUser, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// get all users (admin only)
router.get("/", authenticateUser, requireAdmin, async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
