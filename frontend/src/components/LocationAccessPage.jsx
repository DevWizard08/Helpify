import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ambulanceIconUrl from '../images/ambulance.png';
import Booking from './Booking';
import { motion } from 'framer-motion'; // Import Framer Motion

const LocationAccessPage = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);
    const [booking, setBooking] = useState(false);
    const navigate = useNavigate();
    const mapRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        if (location) {
            if (!mapRef.current) {
                mapRef.current = L.map('map').setView([location.latitude, location.longitude], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapRef.current);
            }

            // Add user location marker
            L.marker([location.latitude, location.longitude]).addTo(mapRef.current)
                .bindPopup('Your Location')
                .openPopup();

            // Create a custom icon for ambulances
            const ambulanceIcon = L.icon({
                iconUrl: ambulanceIconUrl,
                iconSize: [32, 32], // Size of the icon
                iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
                popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
            });

            // Generate dynamic ambulance positions close to the user's location
            const generateAmbulancePositions = (numAmbulances) => {
                const positions = [];
                for (let i = 0; i < numAmbulances; i++) {
                    const latOffset = (Math.random() - 0.5) * 0.02; // Random offset within ~2 km
                    const lngOffset = (Math.random() - 0.5) * 0.02;

                    positions.push([
                        location.latitude + latOffset,
                        location.longitude + lngOffset
                    ]);
                }
                return positions;
            };

            const ambulancePositions = generateAmbulancePositions(4); // Generate 4 dynamic ambulance positions

            // Add ambulance markers using the custom icon
            ambulancePositions.forEach((position, index) => {
                const distance = calculateDistance(location.latitude, location.longitude, position[0], position[1]);
                const time = Math.floor(Math.random() * 10) + 5; // Random time between 5 and 15 minutes
                const price = parseFloat((Math.random() * 100 + 20).toFixed(2)); // Random price between $20 and $120
                const passengers = Math.floor(Math.random() * 4) + 1; // Random capacity between 1 and 4 passengers
            
                const ambulance = {
                    name: `Ambulance ${index + 1}`,
                    status: 'Available',
                    distance,
                    time,
                    price,
                    passengers,
                    latitude: position[0], // Add latitude
                    longitude: position[1] // Add longitude
                };
            
                // Create a popup content string
                const popupContent = `
                    <div>
                        <strong>${ambulance.name}</strong><br/>
                        Status: ${ambulance.status}<br/>
                        Distance: ${ambulance.distance.toFixed(2)} km<br/>
                        Estimated Time: ${ambulance.time} minutes<br/>
                        Price: $${ambulance.price.toFixed(2)}<br/>
                        Capacity: ${ambulance.passengers} passengers<br/>
                        <button class="book-now-btn">Book Now</button>
                    </div>
                `;
            
                const marker = L.marker(position, { icon: ambulanceIcon }).addTo(mapRef.current)
                    .bindPopup(popupContent)
                    .on('popupopen', () => {
                        // Add event listener for the "Book Now" button
                        const bookNowBtn = document.querySelector('.book-now-btn');
                        if (bookNowBtn) {
                            bookNowBtn.onclick = () => {
                                setSelectedAmbulance(ambulance);
                                setBooking(true);
                                marker.closePopup(); // Close the popup after booking
                            };
                        }
                    });
            });

            // Center the map on the user's location
            mapRef.current.setView([location.latitude, location.longitude], 13);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [location]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!location) {
        return <div>Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1>Your Location</h1>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
            
            {selectedAmbulance && booking && (
                <Booking
                    userLocation={location}
                    ambulanceLocation={selectedAmbulance}
                    mapRef={mapRef}
                />
            )}
        </motion.div>
    );
};

export default LocationAccessPage;
