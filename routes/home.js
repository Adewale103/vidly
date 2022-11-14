const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("WELCOME TO THE HOME PAGE!!!!");
});

module.exports = router;
