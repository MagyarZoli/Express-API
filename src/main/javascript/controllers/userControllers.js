const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const headersAuthorization = (req, res, next) => {
  if (req.header
      && req.headers.authorization
      && req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(req.headers.authorization.split(" ")[1], "RESTFULAPIs", (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
};

const loginRequired = (req, res, next) => {
  if (req.user) next();
  else return res.status(401).json({ message: "Unauthorized user!" });
};

const signup = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const salt = await bcrypt.genSalt();
    newUser.hashPassword = bcrypt.hashSync(req.body.password, salt);
    await newUser.save();
    return res.json(newUser);
  } catch (err) {
    return res.status(400).send({ message: handleErrors(err) });
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

const handleErrors = (err) => {
  let errors = { message: "" };
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    console.log(1, errors);
    //return errors;
  }
  if (err.message.includes("User validation failed")) {
    errors = { message: err._message };
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
  return err;
};

module.exports = {
  headersAuthorization,
  loginRequired,
  signup,
  login
};
