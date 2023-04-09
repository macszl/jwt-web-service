var express = require("express");
var router = express.Router();

const { login, register } = require("../controllers/authController");

console.log(login);
console.log(register);

console.log(login === undefined);

router.post("/signin", login);

router.post("/signup", register);

module.exports = router;
