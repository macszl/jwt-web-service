require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var resourceRouter = require("./routes/resource");
var authRouter = require("./routes/auth");
var activateRouter = require("./routes/activate");
var menuRouter = require("./routes/menu");

const { UserRole, User, Role } = require("./models/schemas");
const bcrypt = require("bcryptjs");

var app = express();

//database setup
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const hashedPass = bcrypt.hashSync("admin", 10);

const user = new User({
  name: "admin",
  email: "admin@admin.pl",
  password: hashedPass,
  active: true,
});

//save admin user to database if not exists

User.findOne({ name: "admin" })
  .exec()
  .then((res) => {
    if (!res) {
      const res = user.save();
    }
  });

const userEmail = "admin@admin.pl"; // replace with the user's email
const roleName = "admin"; // replace with the role name

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/resource", resourceRouter);
app.use("/auth", authRouter);
app.use("/activate", activateRouter);
app.use("/menu", menuRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
