const express = require("express");
const Joi = require("joi");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "invalid username or password" });
  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword)
    return res.status(400).send({ message: "invalid username or password" });
  const token = user.generateAuthToken();
  res.status(200).send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(8).max(1025).required().email(),
    password: Joi.string().min(8).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
