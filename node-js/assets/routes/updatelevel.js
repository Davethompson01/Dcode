
const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const User = require("../models/user"); // Example model

router.put("/update-access", checkAuth, async (req, res) => {
    try {
        await User.update({ isPaidUser: true }, { where: { id: req.user.id } });
        res.status(200).json({ status: "success", message: "Access level updated." });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update access level." });
    }
});

module.exports = router;
