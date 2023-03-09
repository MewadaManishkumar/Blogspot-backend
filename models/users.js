const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email:{ type: String, required: true, unique: true },
  username: {type: String, required: true},
  password: {type: String, required: true},
  role: String
});

module.exports = mongoose.model("Users", userSchema);

