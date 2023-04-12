var express = require("express");
var router = express.Router();

const { authenticateToken } = require("../controllers/authController");

router.get("/", authenticateToken, function (req, res, next) {
  res.render("usermenu", { title: "Express" });
});

module.exports = router;
