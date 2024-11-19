const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');

//Make model
const Todo = new mongoose.model('Todo', todoSchema)

//get all todos
router.get('/', async (req, res) => {

})
//get a todo by id
router.get('/:id', async (req, res) => {

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

})
//put a todo 
router.put('/:id', async (req, res) => {

})
//delete todo 
router.delete('/:id', async (req, res) => {

})

module.exports = router;