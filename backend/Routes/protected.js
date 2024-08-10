const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // Import the middleware

router.get('/protected-route', authenticateToken, (req, res) => {
    // This route is protected and only accessible if a valid token is provided
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
