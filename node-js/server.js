const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import your routes
const productRoutes = require("./assets/routes/product");
const signupRoutes = require("./assets/routes/signup");
const orderRoutes = require("./assets/routes/order");
const loginRoute = require("./assets/routes/login");

const app = express();

app.use(cors()); // Allows all origins; configure if necessary
app.use(bodyParser.json()); // Parse JSON bodies

app.use("/product", productRoutes); // Product routes
app.use("/api/auth", signupRoutes); // Signup routes
app.use("/order", orderRoutes); // Order routes
app.use("/api/auth", loginRoute);
app.get("/", (req, res) => {
  return res.json({
    message: "running",
  });
});

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
