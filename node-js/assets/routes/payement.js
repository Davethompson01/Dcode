// payment.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const checkAuth = require("../middlewares/auth");

router.post("/create-payment-intent", checkAuth, async (req, res) => {
    try {
        // Assuming you have some way to determine the price for the plan
        const amount = 999; // In cents, $9.99 for example

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
            metadata: { userId: req.user.id }, // Optional metadata
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            status: "success",
            message: "Payment initiated",
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({
            status: "error",
            message: "Payment initiation failed",
            error: error.message,
        });
    }
});

module.exports = router;
