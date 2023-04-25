const express = require("express");
const os = require("os");
const router = express.Router();

/* GET */
router.get("/api/getUserName", (req, res, next) => {
	res.send({ username: os.userInfo().username });
});

module.exports = router;
