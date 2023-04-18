const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');



router.post('/register', async (req, res) => {
  console.log('Inside /register endpoint');
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json('Username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hashedPassword,
    favorites: [],
  });

  try {
    await newUser.save();
    console.log('User registered');
    res.status(201).json('User registered');
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  console.log('Inside /login endpoint');
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json('Invalid username or password');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json('Invalid username or password');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log('User logged in');
  
  // Set the JWT token as a cookie with the name "token"
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  
  res.status(200).json({ token });
});

router.get('/favorites', authMiddleware, async (req, res) => {
  console.log('Inside /favorites endpoint');
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    console.log('Favorites fetched');
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json('Error fetching favorites');
  }
});

router.put('/user/:id/favorites', async (req, res) => {
  console.log('Inside /favorites endpoint');
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { favorites: req.body } },
      { new: true }
    );

    if (!user) {
      console.error('User not found');
      return res.status(404).json('User not found');
    }

    console.log('Favorites updated');
    res.json(user);
  } catch (error) {
    console.error('Error updating favorites:', error.message);
    res.status(500).json('An error occurred. Please try again.');
  }
});

router.get('/users/:id/favorites', async (req, res) => {
  console.log('Inside /favorites endpoint');
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error('User not found');
      return res.status(404).json('User not found');
    }
    console.log('Favorites fetched');
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json('Error fetching favorites');
  }
  });
  
  router.post('/logout', async (req, res) => {
  console.log('Inside /logout endpoint');
  
  // Clear the JWT token cookie
  res.clearCookie('token');
  
  res.status(200).json('User logged out');
  });
  
  module.exports = router;



