const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 15,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phoneNumber: Joi.string().min(7).max(15).required(),
    isGold: Joi.boolean(),
  };

  return Joi.validate(customer, schema);
}

module.exports = {
  Customer,
  validateCustomer,
  customerSchema,
};
