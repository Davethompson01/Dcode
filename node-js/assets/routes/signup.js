const express = require("express");
const axios = require("axios");
const router = express.Router();

// Endpoint for user signup
router.post("/signup/user", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost/D_code/PHP/api/Auth/UserSignup.php",
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "User  signup failed.",
      error: error.message,
    });
  }
});

// Endpoint for admin signup
router.post("/signup/admin", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost/D_code/PHP/api/Auth/Adminsignup.php",
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "Admin signup failed.",
      error: error.message,
    });
  }
});

module.exports = router;
