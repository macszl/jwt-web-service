var express = require("express");
var router = express.Router();

const {
  authenticateTokenAdmin,
  authenticateToken,
} = require("../controllers/authController");
const { activate } = require("../controllers/activationController");

router.post("/:id", authenticateTokenAdmin, activate);

module.exports = router;
