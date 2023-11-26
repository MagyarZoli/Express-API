import express, { Request, Response } from "express";
import session from "express-session";
import path from 'path';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import mongoRouter from "./router/mongoRouter";
import { checkUser } from "./middleware/userMiddleware";
import passportSetup from "./config/passportSetup";

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
  secret: process.env.COOKIE_SESSION_KEY!,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(checkUser);
app.use(mongoRouter);

app.set("views", path.join(__dirname, "../../../views/ejs"));
app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => res.render("home"));

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});

export default app;
