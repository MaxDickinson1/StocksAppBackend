const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://stately-salmiakki-6c7124.netlify.app', 
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', () => {
  console.log('MongoDB connection established');
});

// Import routes
const userRoutes = require('./routes/users'); 

// Use routes
app.use('/api/users', userRoutes); 

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


