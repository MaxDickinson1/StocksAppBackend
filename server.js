const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://maxdickinson17:CashMoney@cluster0.z1dxmwi.mongodb.net/stock_crypto_app?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Import routes
const usersRoute = require('./routes/users');

// Use routes
app.use('/users', usersRoute);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

