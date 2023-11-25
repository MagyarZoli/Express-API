const passport = require("passport");
const dotenv = require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20");
const GitHubStrategy = require("passport-github2");
const FacebookStrategy = require("passport-facebook");

const User = require("../models/UserModel");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({googleId: profile.id});
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            googleId: profile.id,
            username: profile.displayName,
            email: `google_${profile.id}@example.com`,
            password: `${process.env.STRATEGY_PASSWORD}_${profile.id}`
          }).save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    })
);

passport.use(
  new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/redirect"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({githubId: profile.id});
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            githubId: profile.id,
            username: profile.username,
            email: `github_${profile.id}@example.com`,
            password: `${process.env.STRATEGY_PASSWORD}_${profile.id}`
          }).save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    })
);

passport.use(
  new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/redirect"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({facebookId: profile.id});
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            facebookId: profile.id,
            username: profile.displayName,
            email: `facebook_${profile.id}@example.com`,
            password: `${process.env.STRATEGY_PASSWORD}_${profile.id}`
          }).save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    })
);