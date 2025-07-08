import attendanceService from '../services/attendanceService.js';
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';

/**
 * @desc    Clock in for the current user
 * @route   POST /api/attendance/clock-in
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const clockIn = asyncHandler(async (req, res) => {
    try {
        const attendance = await attendanceService.clockIn(req.user.id);
        sendSuccessResponse(res, 201, 'Clocked in successfully', attendance);
    } catch (error) {
        sendErrorResponse(res, 400, error.message);
    }
});

/**
 * @desc    Clock out for the current user
 * @route   POST /api/attendance/clock-out
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const clockOut = asyncHandler(async (req, res) => {
    try {
        const attendance = await attendanceService.clockOut(req.user.id);
        sendSuccessResponse(res, 200, 'Clocked out successfully', attendance);
    } catch (error) {
        sendErrorResponse(res, 400, error.message);
    }
});

/**
 * @desc    Get user attendance records with optional date filtering
 * @route   GET /api/attendance/user/:userId
 * @access  Private
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getUserAttendance = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        const attendance = await attendanceService.getUserAttendance(userId, startDate, endDate);
        sendSuccessResponse(res, 200, 'Attendance retrieved successfully', {
            count: attendance.length,
            attendance
        });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Get attendance report with filtering options
 * @route   GET /api/attendance/report
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const getAttendanceReport = asyncHandler(async (req, res) => {
    try {
        const { startDate, endDate, department } = req.query;
        const attendance = await attendanceService.getAttendanceReport({ startDate, endDate, department });

        sendSuccessResponse(res, 200, 'Attendance report generated successfully', {
            count: attendance.length,
            attendance
        });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
});

/**
 * @desc    Update attendance record (Admin only)
 * @route   PUT /api/attendance/:id
 * @access  Private/Admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
export const updateAttendance = asyncHandler(async (req, res) => {
    try {
        const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
        sendSuccessResponse(res, 200, 'Attendance updated successfully', attendance);
    } catch (error) {
        sendErrorResponse(res, 404, error.message);
    }
});
