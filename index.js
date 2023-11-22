const express = require("express");
const jwt = require("jsonwebtoken");

const objectRouter = require("./src/main/javascript/router/objectRouter");
const mongoRouter = require("./src/main/javascript/router/mongoRouter");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/views", express.static("views"));
app.use((req, res, next) => {
  if (req.header
    && req.headers.authorization
    && req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(req.headers.authorization.split(" ")[1], "RESTFULAPIs", (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use("/object", objectRouter);
app.use("/mongo", mongoRouter);

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
