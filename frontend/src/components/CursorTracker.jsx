// src/CursorTracker.js
import React, { useEffect, useRef } from 'react';
import wolfImage from '../images/wolf.png'; // Update with the correct path to your wolf image

const CursorTracker = () => {
    const wolfRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (wolfRef.current) {
                wolfRef.current.style.left = `${e.clientX}px`;
                wolfRef.current.style.top = `${e.clientY}px`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={wolfRef}
            style={{
                position: 'absolute',
                pointerEvents: 'none', // Prevent the wolf from interfering with mouse events
                transition: 'transform 0.1s', // Smooth movement
                transform: 'translate(-50%, -50%)', // Center the image at the cursor
            }}
        >
            <img src={wolfImage} alt="Wolf" style={{ width: '50px', height: '50px' }} />
        </div>
    );
};

export default CursorTracker;
