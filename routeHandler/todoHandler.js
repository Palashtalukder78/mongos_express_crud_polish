const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");

//Make model
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

//get all todos
router.get("/", checkLogin, async (req, res) => {
  try {
    const todos = await Todo.find({})
      .populate("user", "username name -_id") // bring data(username, user) and except _id from User collection and put it into user field
      .select({ _id: 0, __v: 0, date: 0 });
    // .limit(2);
    res.status(200).json({
      message: "Get all Data Successfully!",
      result: todos,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});
//get active todos- MAKING INSTANCE METHOD
router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
      message: "Get Single Data Successfully!",
      result: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//get todos by title-Talukder- MAKING STATIC METHOD
router.get("/talukder", async (req, res) => {
  try {
    const data = await Todo.findByTalukder();
    res.status(200).json({
      message: "Get Single Data Successfully!",
      result: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//get todos by title-author name- MAKING QUERY Helper
router.get("/author", async (req, res) => {
  try {
    const data = await Todo.find().byAuthor("Arish");
    res.status(200).json({
      message: "Get Single Data Successfully!",
      result: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//get a todo by id
router.get("/:id", async (req, res) => {
  try {
    const todos = await Todo.find({ _id: req.params.id }).select({
      _id: 0,
      __v: 0,
      date: 0,
    });
    res.status(200).json({
      message: "Get Single Data Successfully!",
      result: todos,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//post a todo
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      message: "Data inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});
//post multiple todo
router.post("/all", async (req, res) => {
  try {
    await Todo.insertMany(req.body);
    // await Todo.save();
    res.status(200).json({
      message: "Many Data inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//put a todo
router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      { status: "active" },
      { new: true }
    );
    res.status(200).json({
      message: "Data update successfully!",
    });
    console.log(result);
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

//delete todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Single Data delete Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});
//delete many todo
router.delete("/", async (req, res) => {
  try {
    await Todo.deleteMany({ status: "active" });
    res.status(200).json({
      message: "Multiple Data delete Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});

module.exports = router;
