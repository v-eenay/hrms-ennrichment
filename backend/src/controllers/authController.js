import authService from '../services/authService.js';
import { asyncHandler } from '../utils/responseHandler.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    try {
        const userData = await authService.register(req.body);
        sendSuccessResponse(res, 201, 'User registered successfully', userData);
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
        sendSuccessResponse(res, 200, 'Login successful', userData);
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
