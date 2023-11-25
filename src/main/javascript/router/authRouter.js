const express = require("express");
const passport = require("passport");

const userControllers = require("../controllers/userControllers");

const router = express.Router();

const DAY = 24 * 60 * 60;

router.get("/google", passport.authenticate("google", {scope: ["profile"]}));

router.get("/google/redirect", passport.authenticate("google", {failureRedirect: "/login"}), (req, res) => {
  const token = userControllers.createToken(req.user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
  res.redirect("/");
});

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}));

router.get("/github/redirect", passport.authenticate("github", {failureRedirect: "/login"}), (req, res) => {
  const token = userControllers.createToken(req.user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
  res.redirect("/");
});

router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/redirect", passport.authenticate("facebook", {failureRedirect: "/login"}), (req, res) => {
  const token = userControllers.createToken(req.user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
  res.redirect("/");
});

module.exports = router;