const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();
const auth = require("../middleware/auth");
const { Movie, validateMovie } = require("../models/movie");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send(`Movie with the given ID not found`);
  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send(`Movie with the given ID not found`);
  res.send({
    message: `Movie with ID ${req.params.id} has been successfully deleted`,
  });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.send(error.details[0].message);
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie) return res.status(404).send(`Movie with the given ID not found`);
  req.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res
      .status(400)
      .send({ message: `Genre with ${req.body.genreId} as Id not found!` });

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();
  res.send(movie);
});

module.exports = router;
