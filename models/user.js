const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1025,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: self._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(8).max(1025).required().email(),
    password: Joi.string().min(8).max(255).required(),
  };

  return Joi.validate(user, schema);
}

function validatePassword(password) {
  return passwordComplexity().validate(password);
}

module.exports = {
  User,
  validateUser,
  validatePassword,
};
