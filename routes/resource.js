var express = require("express");
var router = express.Router();

router.get("/public", function (req, res, next) {
  res.render("resource", { title: "Express" });
});

router.get("/user", function (req, res, next) {
  res.render("resource", { title: "Express" });
});

router.get("/admin", function (req, res, next) {
  res.render("resource", { title: "Express" });
});

module.exports = router;
