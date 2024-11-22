const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = require("../schemas/userSchema");

//Make model
const User = new mongoose.model("User", userSchema);

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

module.exports = router;
