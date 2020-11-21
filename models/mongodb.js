const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/CoursesManagementSystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database sucessfully ....."))
  .catch((err) => console.log("failed to connect to database .", err));

require("./course.model");
require("./author.model");
