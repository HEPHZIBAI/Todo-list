const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');


const app = express();
app.use(express.json());
app.use(cors());

//connect database
mongoose.connect('mongodb://localhost:27017/todo-list')
.then(() =>{
    console.log('DB connected!');
})
.catch((err)=>{
    console.log(err);
})

//create schema
const todoschma =new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String
});

//create model
const todomodel = mongoose.model('todo',todoschma)

//create item
app.post('/todos',async(req,res)=>{
    const {title , description} = req.body;

    try
    {
        const newtodo = new todomodel({title,description});
        await newtodo.save();
        res.status(201).json(newtodo);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }

});

//get items

app.get('/todos',async(req,res) =>{
    try
    {
        const todos = await todomodel.find();
        res.json(todos);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }  
})

//update
app.put("/todos/:id",async(req,res)=>{
    try
    {
        const {title , description} = req.body;
        const id = req.params.id;
        const updatedtodo=await todomodel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
        );

        if(!updatedtodo)
        {
            return res.status(404).json({message:"todo not found"});
        }
        res.json(updatedtodo)
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})


//delete
app.delete('/todos/:id',async(req,res)=>{
    try
    {
        const id = req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})
const port=8000;
app.listen(port,()=>{
    console.log("server is listening to port "+port);
})
