import payrollService from '../services/payrollService.js';
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';
import { validateRequiredFields } from '../utils/validation.js';

/**
 * @desc    Get all payrolls with filtering options
 * @route   GET /api/payroll
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getPayrolls = asyncHandler(async (req, res) => {
    try {
        const { month, year, userId, page = 1, limit = 10 } = req.query;
        const filters = { month, year, userId };
        const pagination = { page: parseInt(page), limit: parseInt(limit) };

        const payrolls = await payrollService.getAllPayrolls(filters, pagination);
        sendSuccessResponse(res, 200, 'Payrolls retrieved successfully', payrolls);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Get user payroll records
 * @route   GET /api/payroll/user/:userId
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getUserPayroll = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;
        const filters = { month, year };

        const payrolls = await payrollService.getUserPayroll(userId, filters);
        sendSuccessResponse(res, 200, 'User payroll retrieved successfully', payrolls);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Create payroll record
 * @route   POST /api/payroll
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const createPayroll = asyncHandler(async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['userId', 'month', 'year', 'basicSalary'];
        const validation = validateRequiredFields(req.body, requiredFields);

        if (!validation.isValid) {
            return sendErrorResponse(res, 400, `Missing required fields: ${validation.missingFields.join(', ')}`);
        }

        const payroll = await payrollService.createPayroll(req.body);
        sendSuccessResponse(res, 201, 'Payroll created successfully', payroll);
    } catch (error) {
        const statusCode = error.message.includes('already exists') ? 409 : 400;
        sendErrorResponse(res, statusCode, error.message);
    }
});

/**
 * @desc    Update payroll record
 * @route   PUT /api/payroll/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const updatePayroll = asyncHandler(async (req, res) => {
    try {
        const payroll = await payrollService.updatePayroll(req.params.id, req.body);
        sendSuccessResponse(res, 200, 'Payroll updated successfully', payroll);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Get pay slip by ID
 * @route   GET /api/payroll/slip/:id
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getPaySlip = asyncHandler(async (req, res) => {
    try {
        const paySlip = await payrollService.getPaySlip(req.params.id);
        sendSuccessResponse(res, 200, 'Pay slip retrieved successfully', paySlip);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Delete payroll record
 * @route   DELETE /api/payroll/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const deletePayroll = asyncHandler(async (req, res) => {
    try {
        const result = await payrollService.deletePayroll(req.params.id);
        sendSuccessResponse(res, 200, result.message);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});
