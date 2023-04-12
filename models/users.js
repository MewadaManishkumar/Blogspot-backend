const mongoose = require("mongoose");
const enumRole = require("../models/enumRole")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true,lowercase: true },
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: [6, 'Minimum password length is 6 characters'] },
  role: {
    type: String,
    enum : [enumRole.masterAdmin,enumRole.admin,enumRole.author,enumRole.user],
    default: enumRole.user
  },
  isDeleted: {type: Boolean, default: false}
});

module.exports = mongoose.model("Users", userSchema);

