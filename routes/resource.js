var express = require("express");
var router = express.Router();

router.get("/public", function (req, res, next) {
  res.render("resource", { type: "Public" });
});

router.get("/user", function (req, res, next) {
  res.render("resource", { type: "User" });
});

router.get("/admin", function (req, res, next) {
  res.render("resource", { type: "Admin" });
});

module.exports = router;
