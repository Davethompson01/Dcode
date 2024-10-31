// app.js
const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('../assets/routes/order');

const app = express();
app.use(bodyParser.json());

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
