const express = require('express');
const bodyParser = require('body-parser');
const loginRoute = require('../assets/routes/login');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// Register login route
app.use('/api', loginRoute);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Node.js microservice running on port ${PORT}`);
});
