const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Protecting user from acessing the token
router.get('/', authenticateToken, (req, res) => {
    res.json({
        message: 'Protected Data',
        user: req.user
    });
});

module.exports = router;
