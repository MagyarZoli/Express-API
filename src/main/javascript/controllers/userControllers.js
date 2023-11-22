const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const loginRequired = (req, res, next) => {
  if (req.user) next();
  //else return res.status(401).json({ message: "Unauthorized user!"});
};

const register = async (req, res) => {
  try {
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 12);
    await newUser.save();
    newUser.hashPassword = undefined;
    return res.json(newUser);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed. No user found" });
    }
    if (!user.comparePassword(req.body.password, user.hashPassword)) {
      return res.status(401).json({ message: "Authentication failed. Wrong password" });
    }
    return res.json({
      token: jwt.sign( {
        email: user.email,
        username: user.username,
        _id: user.id
      }, "RESTFULAPIs")
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  loginRequired,
  register,
  login
};
