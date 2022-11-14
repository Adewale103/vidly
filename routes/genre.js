const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Genre, validateGenre } = require("../models/genre");
const { findByIdAndUpdate, findByIdAndDelete } = require("mongoose/lib/model");

router.get("/", async (req, res) => {
  const genre = await Genre.find();
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send(`Genre with ID ${req.params.id} not found!`);
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);
  const foundGenre = await Genre.findOne({ name: req.body.name });
  if (foundGenre)
    return res
      .status(400)
      .send(`Genre with name '${req.body.name}' already exist!`);

  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);

  const genre = await findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send(`Genre with Id ${req.params.id} not found!`);

  res.send({
    message: `Genre with Id ${req.params.id} successfully updated!`,
  });
});

router.delete("/:id", auth, (req, res) => {
  const genre = findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send(`Genre with Id ${req.params.id} not found!`);
  res.send({
    message: `Genre with Id ${req.params.id} successfully deleted!`,
  });
});
module.exports = router;
