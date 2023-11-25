const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const dotenv = require("dotenv");

const User = require("../models/UserModel");

dotenv.config();

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
    callbackURL: "/auth/google/redirect",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
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
          email: `profile2@gmail.com`,
          password: profile.id,
        }).save();
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  })
);