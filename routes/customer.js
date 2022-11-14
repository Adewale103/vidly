const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send(`Customer with the given ID not found`);
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(404).send(`Customer with the given ID not found`);
  res.send({
    message: `Customer with ID ${req.params.id} has been successfully deleted`,
  });
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phoneNumber: req.body.phoneNumber,
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send(`Customer with the given ID not found`);
  req.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(error.details[0].message);
  const foundCustomer = await Customer.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (foundCustomer)
    return res
      .status(400)
      .send({ message: `Customer with given phone number already exist` });
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phoneNumber: req.body.phoneNumber,
  });

  customer = await customer.save();
  res.send(customer);
});

module.exports = router;
