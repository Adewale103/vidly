const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const _ = require("lodash");
const router = express.Router();
const { User, validateUser, validatePassword } = require("../models/user");

router.get("/me", async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.post("/", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const result = validatePassword(req.body.password);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send({ message: "user with given email already exist" });

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
