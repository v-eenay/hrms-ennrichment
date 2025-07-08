import departmentService from '../services/departmentService.js';
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';
import { validateRequiredFields } from '../utils/validation.js';

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getDepartments = asyncHandler(async (req, res) => {
    try {
        const departments = await departmentService.getAllDepartments();
        sendSuccessResponse(res, 200, 'Departments retrieved successfully', departments);
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Get department by ID
 * @route   GET /api/departments/:id
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getDepartmentById = asyncHandler(async (req, res) => {
    try {
        const department = await departmentService.getDepartmentById(req.params.id);
        sendSuccessResponse(res, 200, 'Department retrieved successfully', department);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});

/**
 * @desc    Create new department
 * @route   POST /api/departments
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const createDepartment = asyncHandler(async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name'];
        const validation = validateRequiredFields(req.body, requiredFields);

        if (!validation.isValid) {
            return sendErrorResponse(res, 400, `Missing required fields: ${validation.missingFields.join(', ')}`);
        }

        const department = await departmentService.createDepartment(req.body);
        sendSuccessResponse(res, 201, 'Department created successfully', department);
    } catch (error) {
        const statusCode = error.message.includes('already exists') ? 409 : 400;
        sendErrorResponse(res, statusCode, error.message);
    }
});

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const updateDepartment = asyncHandler(async (req, res) => {
    try {
        const department = await departmentService.updateDepartment(req.params.id, req.body);
        sendSuccessResponse(res, 200, 'Department updated successfully', department);
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 400;
        sendErrorResponse(res, statusCode, error.message);
    }
});

/**
 * @desc    Delete department (soft delete)
 * @route   DELETE /api/departments/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const deleteDepartment = asyncHandler(async (req, res) => {
    try {
        const result = await departmentService.deleteDepartment(req.params.id);
        sendSuccessResponse(res, 200, result.message);
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 400;
        sendErrorResponse(res, statusCode, error.message);
    }
});
