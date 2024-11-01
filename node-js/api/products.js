const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('../assets/routes/product');

const app = express();
app.use(bodyParser.json());

app.use('/api', productRoutes); // Apply routes here without the global authMiddleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
