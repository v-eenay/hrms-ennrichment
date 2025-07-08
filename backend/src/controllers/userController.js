import userService from '../services/userService.js';
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';
import { validateRequiredFields } from '../utils/validation.js';

/**
 * @desc    Get all users with optional filtering and pagination
 * @route   GET /api/users
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getUsers = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, role, department } = req.query;
        const filters = {};

        if (role) filters.role = role;
        if (department) filters.department = department;

        const users = await userService.getAllUsers(filters, { page: parseInt(page), limit: parseInt(limit) });
        sendSuccessResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin or Self
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        sendSuccessResponse(res, 200, 'User retrieved successfully', user);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Create new user
 * @route   POST /api/users
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const createUser = asyncHandler(async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'email', 'password'];
        const validation = validateRequiredFields(req.body, requiredFields);

        if (!validation.isValid) {
            return sendErrorResponse(res, 400, `Missing required fields: ${validation.missingFields.join(', ')}`);
        }

        const user = await userService.createUser(req.body);
        sendSuccessResponse(res, 201, 'User created successfully', user);
    } catch (error) {
        const statusCode = error.message.includes('already exists') ? 409 : 400;
        sendErrorResponse(res, statusCode, error.message);
    }
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        sendSuccessResponse(res, 200, 'User updated successfully', user);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Delete user (soft delete by setting isActive to false)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const deleteUser = asyncHandler(async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        sendSuccessResponse(res, 200, 'User deactivated successfully');
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Get users by department
 * @route   GET /api/users/department/:departmentId
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getUsersByDepartment = asyncHandler(async (req, res) => {
    try {
        const users = await userService.getUsersByDepartment(req.params.departmentId);
        sendSuccessResponse(res, 200, 'Department users retrieved successfully', users);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});
