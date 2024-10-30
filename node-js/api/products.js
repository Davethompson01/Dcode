// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('../assets/routes/product');
const authMiddleware = require('../assets/middlewares/auth');

const app = express();

app.use(bodyParser.json());
app.use(authMiddleware);
app.use('/api', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
