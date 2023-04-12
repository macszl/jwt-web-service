var express = require("express");
var router = express.Router();

const { User } = require("../models/schemas");
const {
  authenticateTokenAdmin,
  authenticateToken,
} = require("../controllers/authController");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", showLogin: false });
});

router.get("/admin", authenticateTokenAdmin, async function (req, res, next) {
  const usersCollection = await User.find();
  console.log(usersCollection);
  res.render("admin", { users: usersCollection });
});

module.exports = router;
