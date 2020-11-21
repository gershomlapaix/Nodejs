const mongoose = require("mongoose");
const Joi = require("joi");

var authorSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: "This field is required",
    minlength: 5,
    maxlength: 255,
  },

  authorEmail: {
    type: String,
    minlength: 5,
    maxlength: 255,
  }  
});

function validateAuthor(author) {
  const schema = {
    authorName: Joi.string().max(255).min(3).required(),
    authorEmail: Joi.string().max(255).min(3).required().email(),
    authorId: Joi.number().required(),
  };
  return Joi.validate(author, schema);
}

mongoose.model("Author", authorSchema);
module.exports = validateAuthor;
