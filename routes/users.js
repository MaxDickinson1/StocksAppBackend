const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

router.post('/register', async (req, res) => {
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
    favorites: { stocks: [], cryptocurrencies: [] },
  });

  try {
    await newUser.save();
    res.status(201).json('User registered');
  } catch (error) {
    res.status(500).json('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json('Invalid username or password');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json('Invalid username or password');
  }

  const token = jwt.sign({ id: user._id }, '7ea4865169e22ca46869c82c83c62c4c9671ff28875bb6d31e404766b087cff3');
  res.status(200).json({ token });
});

router.get('/favorites', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json('Error fetching favorites');
  }
});

router.put('/:id/favorites', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $push: { favorites: req.body } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json('User not found');
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json('An error occurred. Please try again.');
    }
  });
  

module.exports = router;

