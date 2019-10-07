const express = require("express");
const router = express.Router();

// Use routes
router.use('/auth', require('./auth'));

module.exports = router;