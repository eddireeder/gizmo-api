const express = require("express");
const router = express.Router();

// Use routes
router.use("/auth", require("./auth"));
router.use("/sounds", require("./sounds"));
router.use("/configurations", require("./configurations"));

module.exports = router;
