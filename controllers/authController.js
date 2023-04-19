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
    //check if user already exists:
    const userExist = await User.findOne({ name: user.name });
    if (userExist) {
      console.log("user exist");
      throw new Error("User already exists!");
    }

    console.log("Saving user...");
    await user.save();
    console.log("User added successfully!");

    const userEmail = user.email; 
    const roleName = "user";

    Promise.all([
      User.findOne({ email: userEmail }),
      Role.findOne({ name: roleName }),
    ])
      .then(([user, role]) => {
        if (!user) {
          throw new Error(`User with email ${userEmail} not found`);
        }
        if (!role) {
          throw new Error(`Role with name ${roleName} not found`);
        }

        const userRole = new UserRole({
          user: user._id,
          role: role._id,
        });

        const id = user._id;
        if (
          User.findById(id)
            .exec()
            .then((res) => {
              if (!res) {
                userRole.save();
              }
            })
        )
          return null;
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201);
    res.json({
      message: "User added successfully!",
    });
  } catch (error) {
    console.log(error);
    res.setHeader("Location", "/");
    res.setHeader("Refresh", "4; url=/");
    res.status(500);
    res.json({
      message: "An error occurred!",
    });
  }
};

const login = async (req, res, next) => {
  console.log("Logging in user...");
  console.log(req.body);
  try {
    const { login, password } = req.body;
    console.log("Received password: " + password);
    console.log("Received login: " + login);

    const user = await User.findOne({ name: login });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = generateAccessToken({ name: user.name, isAdmin: false });
        res.status(200);
        console.log("User login successful!");
        res.json({
          message: "Login successful!",
          token: token,
        });
      } else if (result && login === "admin") {
        const token = generateAccessToken({ name: user.name, isAdmin: true });
        res.status(200);
        console.log("Admin login successful!");
        res.json({
          message: "Login successful!",
          token: token,
        });
      } else {
        res.status(401);
        console.log("Password does not match!");
        res.json({
          message: "Password does not match!",
        });
      }
    } else {
      res.status(404);
      console.log("User not found!");
      res.json({
        message: "User not found!",
      });
    }
  } catch (error) {
    res.status(500);
    res.json({
      error,
    });
  }
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token && req.cookies && req.cookies.my_cookie_name) {
    token = req.cookies.my_cookie_name.split(" ")[1];
  }

  if (!token) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (error) {
    //redirect to login page
    res.redirect("/");
  }
}

function authenticateTokenAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token && req.cookies && req.cookies.my_cookie_name) {
    token = req.cookies.my_cookie_name.split(" ")[1];
  }

  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (err || !user.isAdmin) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch {
    //redirect to login page
    res.redirect("/");
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2m" });
}

module.exports = {
  register,
  login,
  authenticateToken,
  authenticateTokenAdmin,
  generateAccessToken,
};
