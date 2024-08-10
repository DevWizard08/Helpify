
import React from 'react';

const AmbulanceInfo = ({ ambulance }) => {
    return (
        <div>
            <h2>{ambulance.name}</h2>
            <p>Status: {ambulance.status}</p>
            <p>Distance: {ambulance.distance.toFixed(2)} km</p>
            <p>Estimated Time: {ambulance.time} minutes</p>
            <p>Price: ${ambulance.price.toFixed(2)}</p>
            <p>Capacity: {ambulance.passengers} passengers</p>
        </div>
    );
};

export default AmbulanceInfo;
