require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/schemas");

const patch = (req, res, next) => {
  const { id } = req.params;
  const { token } = req.body;
  console.log("Activating user...");

  try {
    console.log("Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified!");

    console.log("Finding user...");
    const user = User.findOneAndUpdate({ _id: id }, { active: true });
    if (!user) {
      console.log("User not found!");
    } else {
      console.log("User activated successfully!");
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "An error occurred!",
    });
    res.setHeader("Location", "/");
    res.setHeader("Refresh", "4; url=/");
    res.status(302).end();
  }
};

module.exports = { register, login };
