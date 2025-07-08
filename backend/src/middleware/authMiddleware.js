import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { sendErrorResponse } from '../utils/responseHandler.js';

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
    let token;

    // Check for authorization header with Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and exclude password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return sendErrorResponse(res, 401, 'User not found');
            }

            if (!req.user.isActive) {
                return sendErrorResponse(res, 401, 'User account is deactivated');
            }

            next();
        } catch (error) {
            // Handle different JWT errors
            let message = 'Not authorized, token failed';
            if (error.name === 'TokenExpiredError') {
                message = 'Token expired, please login again';
            } else if (error.name === 'JsonWebTokenError') {
                message = 'Invalid token';
            }

            return sendErrorResponse(res, 401, message);
        }
    } else {
        return sendErrorResponse(res, 401, 'Not authorized, no token provided');
    }
};

/**
 * Admin role authorization middleware
 * Ensures user has admin role before allowing access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return sendErrorResponse(res, 403, 'Access denied. Admin role required.');
    }
};

/**
 * Manager role authorization middleware
 * Ensures user has manager or admin role before allowing access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const manager = (req, res, next) => {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
        next();
    } else {
        return sendErrorResponse(res, 403, 'Access denied. Manager role or higher required.');
    }
};

/**
 * Self or admin authorization middleware
 * Allows access if user is accessing their own data or is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const selfOrAdmin = (req, res, next) => {
    if (req.user && (req.user._id.toString() === req.params.id || req.user.role === 'admin')) {
        next();
    } else {
        return sendErrorResponse(res, 403, 'Access denied. You can only access your own data.');
    }
};

/**
 * HR role authorization middleware
 * Ensures user has HR, manager, or admin role before allowing access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const hr = (req, res, next) => {
    if (req.user && ['hr', 'manager', 'admin'].includes(req.user.role)) {
        next();
    } else {
        return sendErrorResponse(res, 403, 'Access denied. HR role or higher required.');
    }
};
