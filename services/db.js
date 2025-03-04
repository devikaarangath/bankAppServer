//Database connection with node

//1 import mongoose
const mongoose = require('mongoose');

//2 Define connection string
mongoose.connect('mongodb://0.0.0.0:27017/test')

//3 create model and schema
//model in express is same as mongodb collecction
const User=mongoose.model('User',
{
   acno:Number,
   username:String,
   password:String,
   balance:Number,
   transaction:[]
})
//4 Export model
module.exports = {
    User
}