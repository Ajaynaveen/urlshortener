const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt=require('bcrypt')
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  cpassword: String,
  activationToken: String,
  isActive: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});


module.exports = mongoose.model('User', userSchema);



