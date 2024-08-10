const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../models/User'); // Import the User model

// Update User Location
router.post('/update-location', authenticateToken, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const userId = req.user.id; // Assume user ID is stored in the token

        // Validate input
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        // Update user location in the database
        const user = await User.findByIdAndUpdate(
            userId,
            { location: { latitude, longitude } },
            { new: true } // Return the updated user
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Location updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
