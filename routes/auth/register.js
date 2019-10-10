const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const db = require("../../config/db");

router.post("/", async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  // Validate parameters
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  } else if (username.indexOf(" ") !== -1) {
    return res
      .status(400)
      .json({ message: "Username must not contain any spaces" });
  } else if (!password) {
    return res.status(400).json({ message: "Password is required" });
  } else if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  } else if (password.length > 127) {
    return res
      .status(400)
      .json({ message: "Password must not exceed 127 characters" });
  }

  // Check that username are not already registered
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE username=$1", [
      username
    ]);
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "An account with these credentials already exists" });
    }
  } catch (e) {
    return next(e);
  }

  // Hash the password and store the user in the DB
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hash
    ]);
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
