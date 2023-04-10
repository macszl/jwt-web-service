var express = require("express");
var router = express.Router();

const { activate } = require("../controllers/activationController");

router.post("/:id", activate);

module.exports = router;
