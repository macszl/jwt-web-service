var express = require("express");
var router = express.Router();

const { User } = require("../models/schemas");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", showLogin: false });
});

router.get("/admin", async function (req, res, next) {
  const usersCollection = await User.find();
  console.log(usersCollection);
  res.render("admin", { users: usersCollection });
});

module.exports = router;
