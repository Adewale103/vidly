const express = require("express");
const config = require("config");
const { default: helmet } = require("helmet");
const genre = require("./routes/genre");
const movie = require("./routes/movie");
const rental = require("./routes/rental");
const mongoose = require("mongoose");
const home = require("./routes/home");
const app = express();
const customer = require("./routes/customer");
const user = require("./routes/user");
const auth = require("./routes/auth");
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log(err.message));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt credentials not provided");
  process.exit(1);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(helmet());

app.use("/api/genres", genre);
app.use("/", home);
app.use("/api/customers", customer);
app.use("/api/movies", movie);
app.use("/api/rentals", rental);
app.use("/api/users", user);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
