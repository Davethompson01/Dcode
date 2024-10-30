// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(bodyParser.json());
app.use(authMiddleware);
app.use('/api', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
