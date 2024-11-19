const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');

//Make model
const Todo = new mongoose.model('Todo', todoSchema)

//get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ status: 'active' }).select({ _id: 0, __v: 0, date: 0 }).limit(2)
        res.status(200).json({
            message: "Get all Data Successfully!",
            result: todos
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
})
//get a todo by id
router.get('/:id', async (req, res) => {
    try {
        const todos = await Todo.find({ _id: req.params.id }).select({ _id: 0, __v: 0, date: 0 })
        res.status(200).json({
            message: "Get Single Data Successfully!",
            result: todos
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
})


//post a todo 
router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(200).json({
            message: "Data inserted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
})
//post multiple todo 
router.post('/all', async (req, res) => {
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
})


//put a todo 
router.put('/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate({ _id: req.params.id }, { status: 'active' }, { new: true });
        res.status(200).json({
            message: "Data update successfully!",
        });
        console.log(result)
    } catch (error) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
})

//delete todo 
router.delete('/:id', async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params.id })
        res.status(200).json({
            message: "Single Data delete Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
})

module.exports = router;