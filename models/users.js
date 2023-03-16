const mongoose = require("mongoose");
const enumRole = require("../models/enumRole")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum : [enumRole.masterAdmin,enumRole.admin,enumRole.author,enumRole.user],
    default: enumRole.user
  }
});

module.exports = mongoose.model("Users", userSchema);

