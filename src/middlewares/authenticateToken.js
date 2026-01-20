const jwt = require('jsonwebtoken');

// Middleware function to authenticate the token
function authenticateToken(req, res, next) {

    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];

    // Split for 'BEARER {token}' and checking if there is an authheader
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.sendStatus(401); // if there isn't any token

    // If the token is not null, then it is verified. We use the 'verify' function to do so
    // It takes the token, the secret key and a callback function with error and user params
    jwt.verify(token, 'kdjgbkjdjgnlervevçle',(err, user) => {
        if (err) return res.sendStatus(403); // if token is no longer valid
        req.user = user;
        next(); // pass the execution to the next middleware
    });
}

module.exports = authenticateToken;
