const router = require("express").Router();

router.get("/", (req, res) => {
  let user = req.user;
  delete user.password;
  res.json({ user: user });
});

module.exports = router;
