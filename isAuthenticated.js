const jwt = require('jsonwebtoken');

module.exports =  async function isAuthenticated(req, res, next) {
    const token = req.headers['authorization'].split(" ")[1];

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.json({message: "Invalid token"});
        } else {
            req.user = decoded;
            next();
        }
    })
}