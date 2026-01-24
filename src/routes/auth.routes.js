require('dotenv').config();
const User = require('../utils/userObj');
const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../data/users');
const router = express.Router();

// Function to generate access token
function generateAccessToken(user) {

    // Serializing the user in jwt with a json object
    // Secret key should be in .env file, with strong random value
    // Using temporary hard coded string for the key, change later!
    return jwt.sign(user, 'kdjgbkjdjgnlervevçle', { expiresIn: '30m' });
}


router.post('/register', (req, res) => {

    // Register User
    const { username, email, password } = req.body;

    // In a real application, you would save the user to the database here
    const id = users.length + 1;
    const newUser = new User(id, username, email, password);
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', (req, res) => {

    // Authenticate User
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'Incorrect Password' });
    }

    const accessToken = generateAccessToken({ id: user.id, username: user.username, email: user.email });

    // Creating a new token from the refresh token (does not expire as quickly as access token)
    // Using temporary hard coded string for the key, change later!
    const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email}, 'daxdazdfzcafzvaggzavggx');

    console.log(`User ${user.username} logged in successfully\n`);
    // What this res.json below basically does is to create a token that contains the user info
    // and is signed with the secret key, so that later we can verify the token
    // and extract the user info from it
    // Also set a expiration date so the user can't use it forever
    // And use refresh tokens to get new access tokens when the old ones expire
    res.json({ accessToken: accessToken, refreshToken: refreshToken });

});


module.exports = router;