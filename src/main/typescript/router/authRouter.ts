import express, { Request, Response } from "express";
import passport from "passport";

import { createToken } from "../controllers/userControllers";
import { MongoUser } from "../models/UserModel";

const router = express.Router();

const DAY = 24 * 60 * 60;

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/redirect", passport.authenticate("google", { failureRedirect: "/login" }), (req: Request & { user?: MongoUser }, res: Response) => {
  const userId = req.user?._id;
  if (userId) {
    const token = createToken(userId);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
    res.redirect("/");
  } else {
    res.status(500).json({ error: "User ID is undefined" });
  }
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/redirect", passport.authenticate("github", { failureRedirect: "/login" }), (req: Request & { user?: MongoUser }, res: Response) => {
  const userId = req.user?._id;
  if (userId) {
    const token = createToken(userId);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
    res.redirect("/");
  } else {
    res.status(500).json({ error: "User ID is undefined" });
  }
});

router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/redirect", passport.authenticate("facebook", { failureRedirect: "/login"} ), (req: Request & { user?: MongoUser }, res: Response) => {
  const userId = req.user?._id;
  if (userId) {
    const token = createToken(userId);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 3 * DAY });
    res.redirect("/");
  } else {
    res.status(500).json({ error: "User ID is undefined" });
  }
});

export default router;
