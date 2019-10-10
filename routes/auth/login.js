const passport = require("passport");
const router = require("express").Router();

router.post("/", passport.authenticate("local"), (req, res) => {
  let user = req.user;
  delete user.password;
  res.json({ user: user });
});

module.exports = router;
