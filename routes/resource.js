var express = require("express");
var router = express.Router();

const {
  authenticateToken,
  authenticateTokenAdmin,
} = require("../controllers/authController");

router.get("/public", function (req, res, next) {
  res.render("resource", { type: "Public" });
});

router.get("/user", authenticateToken, function (req, res, next) {
  res.render("resource", { type: "User" });
});

router.get("/admin", authenticateTokenAdmin, function (req, res, next) {
  res.render("resource", { type: "Admin" });
});

module.exports = router;
