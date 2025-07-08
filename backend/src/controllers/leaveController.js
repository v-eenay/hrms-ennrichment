import leaveService from '../services/leaveService.js';
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';
import { validateRequiredFields } from '../utils/validation.js';

/**
 * @desc    Apply for leave
 * @route   POST /api/leaves
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const applyLeave = asyncHandler(async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['type', 'dateFrom', 'dateTo', 'reason'];
        const validation = validateRequiredFields(req.body, requiredFields);

        if (!validation.isValid) {
            return sendErrorResponse(res, 400, `Missing required fields: ${validation.missingFields.join(', ')}`);
        }

        const leave = await leaveService.applyLeave(req.user.id, req.body);
        sendSuccessResponse(res, 201, 'Leave application submitted successfully', leave);
    } catch (error) {
        sendErrorResponse(res, 400, error.message);
    }
});

/**
 * @desc    Get all leaves with filtering options
 * @route   GET /api/leaves
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getLeaves = asyncHandler(async (req, res) => {
    try {
        const { status, type, userId, page = 1, limit = 10 } = req.query;
        const filters = { status, type, userId };
        const pagination = { page: parseInt(page), limit: parseInt(limit) };

        const leaves = await leaveService.getAllLeaves(filters, pagination);
        sendSuccessResponse(res, 200, 'Leaves retrieved successfully', leaves);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Get user leaves
 * @route   GET /api/leaves/user/:userId
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getUserLeaves = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, type } = req.query;
        const filters = { status, type };

        const leaves = await leaveService.getUserLeaves(userId, filters);
        sendSuccessResponse(res, 200, 'User leaves retrieved successfully', leaves);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Get leave by ID
 * @route   GET /api/leaves/:id
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getLeaveById = asyncHandler(async (req, res) => {
    try {
        const leave = await leaveService.getLeaveById(req.params.id);
        sendSuccessResponse(res, 200, 'Leave retrieved successfully', leave);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Approve leave
 * @route   PUT /api/leaves/:id/approve
 * @access  Private/Manager
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const approveLeave = asyncHandler(async (req, res) => {
    try {
        const leave = await leaveService.approveLeave(req.params.id, req.user.id);
        sendSuccessResponse(res, 200, 'Leave approved successfully', leave);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Reject leave
 * @route   PUT /api/leaves/:id/reject
 * @access  Private/Manager
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const rejectLeave = asyncHandler(async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const leave = await leaveService.rejectLeave(req.params.id, req.user.id, rejectionReason);
        sendSuccessResponse(res, 200, 'Leave rejected successfully', leave);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Cancel leave
 * @route   DELETE /api/leaves/:id
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const cancelLeave = asyncHandler(async (req, res) => {
    try {
        const result = await leaveService.cancelLeave(req.params.id, req.user);
        sendSuccessResponse(res, 200, result.message);
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 400;
        sendErrorResponse(res, statusCode, error.message);
    }
});
