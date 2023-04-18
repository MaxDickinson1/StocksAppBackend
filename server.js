const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow requests only from specified origin
const corsOptions = {
  origin: 'https://stately-salmiakki-6c7124.netlify.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
  console.log('MongoDB connection established');
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

