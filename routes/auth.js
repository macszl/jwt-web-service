var express = require("express");
var router = express.Router();

const { login, register } = require("../controllers/authController");

router.post("/signin", login);

router.post("/signup", register);

module.exports = router;
