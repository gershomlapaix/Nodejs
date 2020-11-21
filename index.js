//Import the necessary package
const startupDebug = require("debug")("app:startup");
const dbDebug = require("debug")("app:db");
const config = require("config");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const app = express();
const log = require("./middlewares/logger");
const userController = require("./controllers/UserController");
const auth = require("./controllers/auth");
const authMiddleware = require("./middlewares/auth");

const admin = require("./middlewares/admin");

//built in middlewares
app.use(bodyparser.urlencoded({ extended: true })); //get access to the post data and convert data posted via html(urlencodede)
app.use(bodyparser.json()); //the data will be accessed through the json format
app.use(express.static("public"));
//third party middlewares
if (app.get("env") == "development") {
  //returns "development" if the NODE_ENV is not defined
  //if(process.env.NODE_ENV =='development'){
  app.use(morgan("tiny")); //it generates the loog automatically
  //custom middlewares
  app.use(log);
}

require("./models/mongodb");
const courseController = require("./controllers/courseController");
const authorController = require("./controllers/authors.Controler");

if (!config.get("jwtPrivateKey")) {
  console.log("JWT PRIVATE KEY IS NOT DEFINED");
  process.exit(1);
}

//Create a welcome message and direct them to the main page
app.get("/", (req, res) => {
  res.send("Welcome to our app");
});

//Set the Controller path which will be responding the user actions
// app.use('/api/courses', authMiddleware, courseController);
app.use("/api/courses", [authMiddleware, admin], courseController);
app.use("/api/courses", authMiddleware, courseController);
app.use("/api/authors", authMiddleware, authorController);
app.use("/api/users", userController);
app.use("/api/auth", auth);
//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
