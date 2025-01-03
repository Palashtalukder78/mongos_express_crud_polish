const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");

//Make user model
const User = new mongoose.model("User", userSchema);

//Get all User
router.get("/", async (req, res) => {
  try {
    const users = await User.find({})
      .populate("todos", "title description status") // bring data(username, user) and except _id from User collection and put it into user field
      .select({ _id: 0, __v: 0, password: 0 });
    // .limit(2);
    res.status(200).json({
      message: "Get all Data Successfully!",
      result: users,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//SignUp
router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "User created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "Signup Failed!",
    });
  }
});

//Signin
router.post("/signin", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        //Generate web token
        var token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          accessToken: token,
          message: "Login successfully!",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed!",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
});

module.exports = router;
