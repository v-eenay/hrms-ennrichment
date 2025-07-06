import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Verify JWT Token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
