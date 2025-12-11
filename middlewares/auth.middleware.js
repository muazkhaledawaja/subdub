import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

 const authorize = async (req, res, next) => {
    try {
        let token;

        // Extract token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify token - use JWT_SECRET from your config
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user by userId (not id) - match your token payload
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        // Handle different JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        
        // Pass other errors to error handler
        next(error);
    }
}

export default authorize;