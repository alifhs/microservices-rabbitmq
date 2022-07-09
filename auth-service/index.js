const express =  require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('./User');
const app = express();

mongoose.connect('mongodb://localhost/auth-service', {
    useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to AuthService MongoDB');
    }
});
app.use(express.json());


app.post('/auth/login', async(req, res) => {
    const {email, password } = req.body;

    const user = await User.findOne({email});


    if (!user) {
        return res.json({message :  " User not found"});
    } else {
        if (user.password != password) {
            return res.json({message :  " Password is incorrect"});
        }
        const payload = {
            email,
            name : user.name,

        }
        jwt.sign(payload, 'secret', {expiresIn : '1h'}, (err, token) => {
            if (err) {
                console.log(err);
            } else {
                res.json({token});
            }
        });
    }

})
app.post('/auth/register', async(req, res) => {
    const {email, password, name} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        return res.json({message : "User already exists"});
    } else {
        const newUser = new User({  
            name,
            email,
            password,
          })

          newUser.save();
          return res.json(newUser);
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})