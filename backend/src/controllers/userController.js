import userService from '../services/userService.js';
import fileService from '../services/fileService.js';
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

        // Create user first
        const user = await userService.createUser(req.body);

        // Handle optional profile picture upload
        if (req.file) {
            try {
                await userService.uploadProfilePicture(user._id, req.file, req);
                // Fetch updated user data with profile picture
                const updatedUser = await userService.getUserById(user._id);
                sendSuccessResponse(res, 201, 'User created successfully with profile picture', updatedUser);
            } catch (uploadError) {
                // User was created but profile picture upload failed
                // Return user data with warning about profile picture
                sendSuccessResponse(res, 201, 'User created successfully, but profile picture upload failed', user);
            }
        } else {
            sendSuccessResponse(res, 201, 'User created successfully', user);
        }
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

/**
 * @desc    Upload profile picture for user
 * @route   POST /api/users/:id/profile-picture
 * @access  Private/Admin or Self
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const uploadProfilePicture = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return sendErrorResponse(res, 400, 'No file uploaded. Please select a profile picture.');
        }

        const user = await userService.uploadProfilePicture(req.params.id, req.file, req);
        sendSuccessResponse(res, 200, 'Profile picture uploaded successfully', user);
    } catch (error) {
        sendErrorResponse(res, 400, error.message);
    }
});

/**
 * @desc    Get profile picture for user
 * @route   GET /api/users/:id/profile-picture
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getProfilePicture = asyncHandler(async (req, res) => {
    try {
        const pictureInfo = await userService.getProfilePictureInfo(req.params.id, req);

        if (!pictureInfo) {
            return sendErrorResponse(res, 404, 'Profile picture not found');
        }

        // Get file stream and serve the image
        const fileData = fileService.getFileStream(pictureInfo.path);

        // Set appropriate headers
        res.set({
            'Content-Type': fileData.contentType,
            'Content-Length': fileData.size,
            'Last-Modified': fileData.lastModified.toUTCString(),
            'Cache-Control': 'public, max-age=86400' // Cache for 1 day
        });

        // Stream the file
        fileData.stream.pipe(res);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Delete profile picture for user
 * @route   DELETE /api/users/:id/profile-picture
 * @access  Private/Admin or Self
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const deleteProfilePicture = asyncHandler(async (req, res) => {
    try {
        const user = await userService.removeProfilePicture(req.params.id);
        sendSuccessResponse(res, 200, 'Profile picture removed successfully', user);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});
