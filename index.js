const express = require("express")
const mongoose = require('mongoose');
const todoHandler = require("./routeHandler/todoHandler");

//express app initialization
const app = express();
app.use(express.json())


//database connection with mongoose
mongoose.connect('mongodb://localhost/todos')
    .then(() => {
        console.log('Connection successfully')
    }).catch((err) => {
        console.log(err)
    });

//application routes
app.use('/todo', todoHandler)

//default error handling
function errorHandler(err,req,res,next){
    if(res.headerSend){
        return next(err)
    }
    res.status(500).json({error: err})
}

//listining app
app.listen(4000, ()=>{
    console.log('app listening port: 4000')
})