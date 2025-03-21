const jwt = require('jsonwebtoken');

// Middleware function
const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1]; //Bearer token

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