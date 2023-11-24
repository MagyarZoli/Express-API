const express = require("express");
const path = require('path');
const cookieParser = require("cookie-parser");

const objectRouter = require("./src/main/javascript/router/objectRouter");
const mongoRouter = require("./src/main/javascript/router/mongoRouter");
const UserMiddleware = require("./src/main/javascript/middleware/userMiddleware");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(UserMiddleware.checkUser);
app.use("/object", objectRouter);
app.use("/mongo", mongoRouter);

app.set("views", path.join(__dirname, "views/ejs"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("home"));

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
