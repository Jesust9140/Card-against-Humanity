const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Card = require('../models/Card');
const fs = require('fs');

// Middleware to check login
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

// Home Page
router.get('/', (req, res) => {
  res.render('pages/home', { user: req.session.user });
});

// Login
router.get('/login', (req, res) => res.render('pages/login'));
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await user.matchPassword(req.body.password)) {
    req.session.userId = user._id;
    req.session.user = user;
    res.redirect('/game');
  } else {
    res.redirect('/login');
  }
});

// Register
router.get('/register', (req, res) => res.render('pages/register'));
router.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.redirect('/login');
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Game Page
router.get('/game', isAuthenticated, (req, res) => {
  res.render('pages/game', { user: req.session.user });
});

// API to get cards
router.get('/cards', async (req, res) => {
  const white = await Card.find({ type: 'white' });
  const black = await Card.find({ type: 'black' });
  res.json({ white, black });
});

// Load cards from json (one time)
router.get('/loadcards', async (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data/cards.json', 'utf8'));
  await Card.deleteMany();
  await Card.insertMany([
    ...data.whiteCards.map(text => ({ text, type: 'white' })),
    ...data.blackCards.map(text => ({ text, type: 'black' }))
  ]);
  res.send('Cards loaded!');
});

module.exports = router;
