const express = require('express');
const cors = require('cors'); // Require the cors package
const signupRoutes = require('../assets/routes/signup'); // Adjust the path as necessary

const app = express();

// Use CORS middleware
app.use(cors()); // This will allow all origins. You can configure it further if needed.

app.use(express.json());
app.use('/api', signupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});