const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../../config/config");

// POST /login route in Node.js
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Send login data to PHP service
    const phpResponse = await axios.post(
      config.phpServiceUrl,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Send the response from PHP service back to the client
    return res.status(phpResponse.status).json(phpResponse.data); // Ensure to return here
  } catch (error) {
    console.error("Error connecting to PHP service:", error.message);
    return res.status(500).json({ status: "error", message: "Internal server error" }); // Ensure to return here
  }
});

module.exports = router;