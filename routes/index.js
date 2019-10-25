const express = require("express");
const router = express.Router();

// Use routes
router.use("/auth", require("./auth"));
router.use("/sounds", require("./sounds"));
router.use("/configuration", require("./configuration"));

module.exports = router;
