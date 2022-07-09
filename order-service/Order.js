const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    products: [{
        product_id : String,
    }],
    user: String,
    total_price : Number,
    createdAt: {
        type : Date,
        default : Date.now()
    }
})

module.exports =  mongoose.model('order', OrderSchema);