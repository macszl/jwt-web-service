require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/schemas");
const { getJwtSecretValue, getJwtExpirationTime } = require("../config/auth");

const register = async (req, res, next) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    });
    await user.save();
    res.json({
      message: "User added successfully!",
    });
  } catch (error) {
    res.json({
      message: "An error occurred!",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { name: username }] });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign({ name: user.name }, getJwtSecretValue(), {
          expiresIn: getJwtExpirationTime(),
        });
        res.json({
          message: "Login successful!",
          token,
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