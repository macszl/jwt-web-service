require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/schemas");

const register = async (req, res, next) => {
  console.log(req.body);
  console.log("Registering user...");
  try {
    console.log("Hashing pass...");
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    console.log("Creating user...");
    const user = new User({
      name: req.body.login,
      email: req.body.email,
      password: hashedPass,
      active: false,
    });
    console.log("Saving user...");
    await user.save();
    console.log("User added successfully!");
    res.json({
      message: "User added successfully!",
    });
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

const login = async (req, res, next) => {
  console.log("Logging in user...");
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ $or: [{ name: login }] }).maxTimeMS(2);
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
          expiresIn: "2m",
        });
        res.json({
          message: "Login successful!",
          token: token,
        });
      } else {
        res.json({
          message: "Password does not match!",
        });
      }
    } else {
      res.json({
        message: "User not found!",
      });
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};

module.exports = { register, login };
