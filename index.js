const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");

//express app initialization
const app = express();
dotenv.config();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => {
    console.log("Connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

//default error handling
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);
//listining app
app.listen(4000, () => {
  console.log("app listening port: 4000");
});
