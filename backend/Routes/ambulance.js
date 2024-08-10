const express = require('express');
const Ambulance = require('../models/Ambulance');
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Add new ambulance
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { location, availability } = req.body;

        // Validate input
        if (!location || !availability) {
            return res.status(400).json({ message: 'Location and availability are required' });
        }

        // Create a new ambulance entry
        const newAmbulance = new Ambulance({
            location,
            availability
        });

        await newAmbulance.save();

        res.status(201).json({ message: 'Ambulance added successfully', ambulance: newAmbulance });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Find nearest ambulance
router.get('/nearest', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        // Validate input
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        // Find the nearest ambulance using the Haversine formula or a similar approach
        // Assuming a simple distance calculation for demonstration
        const ambulances = await Ambulance.find();
        
        // Calculate distance and find the nearest one
        let nearestAmbulance = null;
        let minDistance = Infinity;

        ambulances.forEach(ambulance => {
            const distance = calculateDistance(latitude, longitude, ambulance.location.latitude, ambulance.location.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearestAmbulance = ambulance;
            }
        });

        if (!nearestAmbulance) {
            return res.status(404).json({ message: 'No ambulances found' });
        }

        res.json({ nearestAmbulance, distance: minDistance });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate the distance between two coordinates
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

module.exports = router;
