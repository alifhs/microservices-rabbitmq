const express =  require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const app = express();
const Order = require('./Order');
const  isAuthenticated  = require('../isAuthenticated');


let channel,connection;
async function connect() {
         connection = await amqp.connect('amqp://localhost');
         channel = await connection.createChannel();
        await channel.assertQueue('order');

}

function createOrder (products, userEmail) {

    let totalPrice = 0;
    products.forEach(product => {
        totalPrice += product.price;
    });
    const order = new Order({
        products,
        userEmail,
        total_price : totalPrice,
    });
    order.save();
    return order;

}

connect().then(()=> {
    channel.consume('order', (data)=> {
        const {products, userEmail} = JSON.parse(data.content.toString());
        console.log('consuming order queue');
        console.log(products, userEmail);
        const newOrder =  createOrder(products, userEmail);

        //further process can be added like sending email/text to user through another service
    });
});

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

// app.post('/product/create', isAuthenticated, async (req, res)=> {
//     const {name, description , price} = req.body;
//     const newProduct = new Product({ 
//         name,
//         description,
//         price,
//     })

//     return res.json(newProduct);
// })




const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})