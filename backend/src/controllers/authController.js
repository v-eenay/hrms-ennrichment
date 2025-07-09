import authService from '../services/authService.js';
import { asyncHandler } from '../utils/responseHandler.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';
import { setJWTCookie, clearJWTCookie, getCookieSecurityInfo } from '../utils/cookieConfig.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    try {
        const userData = await authService.register(req.body);

        // Set JWT token as HTTP-only cookie for immediate login after registration
        setJWTCookie(res, userData.token);

        sendSuccessResponse(res, 201, 'User registered successfully', {
            ...userData,
            cookieSet: true,
            cookieInfo: getCookieSecurityInfo()
        });
    } catch (error) {
        sendErrorResponse(res, 400, error.message);
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await authService.login(email, password);

        // Set JWT token as HTTP-only cookie
        setJWTCookie(res, userData.token);

        // Send response with token (for backward compatibility and mobile apps)
        sendSuccessResponse(res, 200, 'Login successful', {
            ...userData,
            cookieSet: true,
            cookieInfo: getCookieSecurityInfo()
        });
    } catch (error) {
        sendErrorResponse(res, 401, error.message);
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id);
        sendSuccessResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    try {
        const userData = await authService.updateProfile(req.user.id, req.body);
        sendSuccessResponse(res, 200, 'Profile updated successfully', userData);
    } catch (error) {
        sendErrorResponse(res, 400, error.message);
    }
});

// @desc    Logout user and clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
    try {
        // Clear the JWT cookie
        clearJWTCookie(res);

        sendSuccessResponse(res, 200, 'Logout successful', {
            message: 'Authentication cookie cleared',
            cookieCleared: true
        });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

// @desc    Check authentication status
// @route   GET /api/auth/status
// @access  Private
export const getAuthStatus = asyncHandler(async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id);
        sendSuccessResponse(res, 200, 'Authentication status retrieved', {
            authenticated: true,
            user: user,
            cookieInfo: getCookieSecurityInfo()
        });
    } catch (error) {
        sendErrorResponse(res, 401, error.message);
    }
});
