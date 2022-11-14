const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 80,
  },

  genre: {
    type: genreSchema,
    required: true,
  },

  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 250,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 250,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(80).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };
  return Joi.validate(movie, schema);
}

module.exports = {
  Movie,
  validateMovie,
  movieSchema,
};
