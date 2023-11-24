const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../models/UserModel");

dotenv.config();

const database = "mongo";

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decodedToken) => {
      if (err) {
        res.redirect(`/${database}/login`);
      } else {
        next();
      }
    });
  } else {
    res.redirect(`/${database}/login`);
  }
};

const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
      res.locals.user = await User.findById(decodedToken.id);
    } else {
      res.locals.user = null;
    }
  } catch (err) {
    res.locals.user = null;
  }
  next();
};

module.exports = {
  requireAuth,
  checkUser
};