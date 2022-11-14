const mongoose = require("mongoose");
const Joi = require("joi");
const { customerSchema } = require("./customer");
const { movieSchema } = require("./movie");
const number = require("joi/lib/types/number");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },
  movie: {
    type: movieSchema,
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  fees: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
    fees: Joi.number().required(),
  };
  return Joi.validate(rental, schema);
}

module.exports = {
  Rental,
  validateRental,
};
