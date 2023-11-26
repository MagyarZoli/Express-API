import passport from "passport";
import dotenv  from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";

import User from "../models/UserModel";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: (arg0: any, arg1: any) => void) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/redirect"
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: { id: any; displayName: any; },
      done: (error: any, user?: any) => any
    ) => {
      try {
        const currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            googleId: profile.id,
            username: profile.displayName,
            email: `google_${profile.id}@example.com`,
            password: `${process.env.STRATEGY_PASSWORD!}_${profile.id}`
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
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "/auth/github/redirect"
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: { id: any; username: any; },
      done: (error: any, user?: any) => any
    ) => {
      try {
        const currentUser = await User.findOne({githubId: profile.id});
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            githubId: profile.id,
            username: profile.username,
            email: `github_${profile.id}@example.com`,
            password: `${process.env.STRATEGY_PASSWORD!}_${profile.id}`
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
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "/auth/facebook/redirect"
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: { id: any; displayName: any; },
      done: (error: any, user?: any) => any
    ) => {
      try {
        const currentUser = await User.findOne({ facebookId: profile.id });
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            facebookId: profile.id,
            username: profile.displayName,
            email: `facebook_${profile.id}@example.com`,
            password: `${process.env.STRATEGY_PASSWORD!}_${profile.id}`
          }).save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    })
);

export default passport;
