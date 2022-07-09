const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    description : String,
    price : Number,
    createdAt: {
        type : Date,
        default : Date.now()
    }
})

module.exports =  mongoose.model('product', ProductSchema);