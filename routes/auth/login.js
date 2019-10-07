const passport = require('passport');
const router = require("express").Router();


router.post("/", passport.authenticate('local'), (req, res) => {
  let user = req.user;
  res.json(user);
});


module.exports = router;