const express =  require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const app = express();
const Product = require('./Product');
const  isAuthenticated  = require('../isAuthenticated');


let channel,connection;
async function connect() {
         connection = await amqp.connect('amqp://localhost');
         channel = await connection.createChannel();
        await channel.assertQueue('product');

}
connect();

mongoose.connect('mongodb://localhost/product-service', {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to Product Service MongoDB');
    }
});
app.use(express.json());

app.post('/product/create', isAuthenticated, async (req, res)=> {
    const {name, description , price} = req.body;
    const newProduct = new Product({ 
        name,
        description,
        price,
    })
    newProduct.save();

    return res.json(newProduct);
})
app.post('/product/buy', isAuthenticated, async (req, res)=> {
    const {ids} = req.body;
   const products = await Product.find({_id: {$in: ids}});
   console.log(products);
    channel.sendToQueue('order', Buffer.from(JSON.stringify({products,
         userEmail : req.user.email})));
    return res.json(products);
});




const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})