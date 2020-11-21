const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
var courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: "This field is required",
    minlength: 5,
    maxlength: 255,
  },
  authorId: {
    type: String,
    minlength: 15,
    maxlength: 255,
  },
});

mongoose.model("Course", courseSchema);

function validateCourse(course) {
  const schema = {
    courseName: Joi.string().max(255).min(3).required(),
    authorId: Joi.objectId().required(),
  };
  return Joi.validate(course, schema);
}

module.exports = validateCourse;
