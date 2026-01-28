require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../data/db');
const bcrypt = require('bcrypt');

// Function to generate access token
function generateAccessToken(user) {

    // Serializing the user in jwt with a json object
    // Secret key should be in .env file, with strong random value
    // Using temporary hard coded string for the key, change later!
    return jwt.sign(user, '4aed8cb2e7964936a3b3cdff0598836314d3783083d31795202c0ae3d70fd225a57b19e2e77a40caf1b746bbbf2a97684b8e1c12e2aa11588aa5c3a7', { expiresIn: '30m' });
}


router.post('/register', async (req, res) => {

    // Register User
    const { username, email, password } = req.body;

    // Saving the user in the database
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query in javascript code
        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Email already exists' });
        }

        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


   

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Finding the email in the database
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        // User is the result, if not valid user not found
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // See if the passwords match
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Creating a new token from the refresh token (does not expire as quickly as access token)
        // Using temporary hard coded string for the key, change later!
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email
        });

        // What this res.json below basically does is to create a token that contains the user info
        // and is signed with the secret key, so that later we can verify the token
        // and extract the user info from it
        // Also set a expiration date so the user can't use it forever
        // And use refresh tokens to get new access tokens when the old ones expire
        res.json({ accessToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;