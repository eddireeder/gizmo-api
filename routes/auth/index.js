const express = require('express');
const router = express.Router();

const isAuthenticated = require('../../middlewares/isAuthenticated');

// Use routes
router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/profile', isAuthenticated, require('./profile'));

module.exports = router;