const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true },
});

const roleModel = new Schema({
  name: { type: String, required: true },
});

const userRoleModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
});

const User = mongoose.model("User", userModel);
const Role = mongoose.model("Role", roleModel);
const UserRole = mongoose.model("User_Role", userRoleModel);

exports.User = User;
exports.Role = Role;
exports.UserRole = UserRole;
