require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());


// Authentication and users routes
app.use('/auth', require('./routes/auth.routes.js'));
app.use('/users', require('./routes/users.routes.js'));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});