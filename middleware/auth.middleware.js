const jwt = require('jsonwebtoken');

// Middleware function
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    // Verify token with secret
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = user;
        next();
    })
}

module.exports = authMiddleware;