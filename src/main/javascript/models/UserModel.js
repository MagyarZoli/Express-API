const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {isEmail} = require("validator");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter an username"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  hashPassword: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
  const minlength = 6;
  if (password !== undefined && password.length >= minlength) {
    return bcrypt.compareSync(password, hashPassword);
  }
  throw Error(`Please enter a valid password that is ${minlength} characters long`);
};

module.exports = mongoose.model("User", UserSchema);
