const express = require("express");
const axios = require("axios");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51QFDiJDFpuWfcKrFXjfG6JXyTbmTB6ynWhH1gynj52DpUA8OsYIPFizOT5Ri1kn6oNd0ycDpJqGyQetIJvgJfLLY00mjQuryO6"
);

// Endpoint for user signup
router.post("/signup/user", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost/D_code/PHP/api/Auth/UserSignup.php",
      req.body
    );

    if (response.status === 200) {
      // Create a Stripe customer
      const customer = await stripe.customers.create({
        email: req.body.email, // Use the email provided during signup
      });

      // Include the user ID from the response
      return res.status(200).json({
        status: "success",
        message: "User signup successful.",
        userId: response.data.userId,
        customerId: customer.id, 
      });
    }

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "User signup failed.",
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
