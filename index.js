const express = require("express");
const jwt = require("jsonwebtoken");
const path = require('path');

const UserController = require("./src/main/javascript/controllers/userControllers");
const objectRouter = require("./src/main/javascript/router/objectRouter");
const mongoRouter = require("./src/main/javascript/router/mongoRouter");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(UserController.headersAuthorization);
app.use("/object", objectRouter);
app.use("/mongo", mongoRouter);

app.set("views", path.join(__dirname, "views/ejs"));
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
