const router = require("express").Router();


router.get("/", (req, res) => {
	let user = req.user;
	res.json(user);
});


module.exports = router;