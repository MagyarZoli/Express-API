const express = require("express");
const passport = require("passport");

const userControllers = require("../controllers/userControllers");

const router = express.Router();

const DAY = 24 * 60 * 60;

router.get("/google", passport.authenticate("google", {
  scope: ["profile"]
}));

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  const token = userControllers.createToken(req.user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
  res.redirect("/");
});

module.exports = router;