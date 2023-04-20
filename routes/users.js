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
    favorites: [],
  });

  try {
    await newUser.save();
    res.status(201).json('User registered');
  } catch (error) {
    console.error('Error registering user:', error.message);
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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Set the JWT token as a cookie with the name "token"
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

  res.status(200).json({ token });
});

// router.get('/favorites', authMiddleware, async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId);
//     res.status(200).json(user.favorites);
//   } catch (error) {
//     console.error('Error fetching favorites:', error.message);
//     res.status(500).json('Error fetching favorites');
//   }
// });

router.put('/:id/favorites', authMiddleware, async (req, res) => {
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
    console.error('Error updating favorites:', error.message);
    res.status(500).json('An error occurred. Please try again.');
  }
});

router.get('/:id/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json('User not found');
    }
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json('Error fetching favorites');
  }
});

router.post('/:id/favorites/add', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { coinId, coinName, coinSymbol, coinImage, coinCurrentPrice, coinDescriptionEn } = req.body;

  console.log('Request body:', req.body); 

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json('User not found');
    }

    user.favorites.push({
      id: coinId,
      name: coinName,
      symbol: coinSymbol,
      image: coinImage,
      current_price: coinCurrentPrice,
      description: { en: coinDescriptionEn },
    });

    await user.save();

    res.status(200).json(user.favorites.find(favorite => favorite.id === coinId));
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    console.error(error); 
    res.status(500).json('An error occurred. Please try again.');
  }
});





router.delete('/:id/favorites/:favoriteId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { favorites: { _id: req.params.favoriteId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json('User not found');
    }

    res.status(200).json('Favorite deleted');
  } catch (error) {
    console.error('Error deleting favorite:', error.message);
    res.status(500).json('An error occurred. Please try again.');
  }
});

router.get('/check-logged-in', authMiddleware, (req, res) => {
  // Check if user is logged in
  if (req.user) {
    res.status(200).json({ currentUser: req.user });
  } else {
    res.status(200).json({ currentUser: null });
  }
});

router.post('/logout', async (req, res) => {
  // Clear the JWT token cookie
  res.clearCookie('token');

  res.status(200).json('User logged out');
});

module.exports = router;

