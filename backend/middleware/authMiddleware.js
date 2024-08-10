const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (token == null) return res.sendStatus(401); // If no token is provided, return Unauthorized

    // Verify the token using the JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return Forbidden

        req.user = user; // Attach user info to the request object
        next(); // Pass control to the next middleware or route handler
    });
}

module.exports = authenticateToken;
