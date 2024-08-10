// src/Booking.js
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder'; // Ensure this is imported

const Booking = ({ userLocation, ambulanceLocation, mapRef }) => {
    useEffect(() => {
        if (userLocation && ambulanceLocation && mapRef.current) {
            // Create a routing control
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation.latitude, userLocation.longitude),
                    L.latLng(ambulanceLocation.latitude, ambulanceLocation.longitude)
                ],
                routeWhileDragging: true,
                geocoder: L.Control.Geocoder.nominatim(), // Use Nominatim for geocoding
                createMarker: () => null // Disable default markers
            }).addTo(mapRef.current);

            // Clean up the routing control on unmount
            return () => {
                if (mapRef.current) {
                    mapRef.current.removeControl(routingControl);
                }
            };
        }
    }, [userLocation, ambulanceLocation, mapRef]);

    return null; // This component does not need to render anything
};

export default Booking;
