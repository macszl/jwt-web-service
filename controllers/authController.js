require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/schemas");

const register = async (req, res, next) => {
  console.log("Registering user...");
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    });
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
  }
};

const login = async (req, res, next) => {
  console.log("Logging in user...");
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { name: username }] });
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
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};

module.exports = { register, login };
