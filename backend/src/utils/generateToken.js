import jwt from 'jsonwebtoken';

/**
 * JWT token generation utilities
 * Contains functions for creating and managing JWT tokens
 */

/**
 * Generate JWT token for user authentication
 * @param {string} id - User ID to include in token payload
 * @param {string} expiresIn - Token expiration time (default: 30d)
 * @returns {string} JWT token
 */
export const generateToken = (id, expiresIn = '30d') => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn,
    });
};

/**
 * Generate refresh token for extended authentication
 * @param {string} id - User ID to include in token payload
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign({ id, type: 'refresh' }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Refresh tokens last 7 days
    });
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - Token to decode
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};


