const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send(`Rental with the given ID not found`);
  res.send(rental);
});

router.delete("/:id", auth, async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental)
    return res.status(404).send(`Rental with the given ID not found`);
  res.send({
    message: `rental with ID ${req.params.id} has been successfully deleted`,
  });
});

router.put("/:id", auth, async (req, res) => {
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      fees: req.body.fees,
    },
    { new: true }
  );
  if (!rental)
    return res.status(404).send(`Rental with the given ID not found`);
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(400).send({
      message: `Customer with ${req.body.customerId} as Id not found!`,
    });

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res
      .status(400)
      .send({ message: `Movie with ${req.body.movieId} as Id not found!` });

  if (movie.numberInStock === 0)
    return res.status(400).send(`Movie not in stock`);

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phoneNumber: customer.phoneNumber,
    },
    movie: {
      title: movie.title,
      genre: movie.genre,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    },
    fees: req.body.fees,
  });

  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

module.exports = router;
