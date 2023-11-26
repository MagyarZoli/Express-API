const express = require("express");
const session = require("express-session");
const path = require('path');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const mongoRouter = require("./router/mongoRouter");
const userMiddleware = require("./middleware/userMiddleware");
const passportSetup = require("./config/passportSetup");

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
  secret: process.env.COOKIE_SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(userMiddleware.checkUser);
app.use(mongoRouter);

app.set("views", path.join(__dirname, "../../../views/ejs"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("home"));

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});

module.exports = app;
