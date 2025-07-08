import { Leave } from '../models/leaveModel.js';
import { calculateTotalDays, isPastDate, isFutureDate } from '../utils/dateUtils.js';
import { validateLeaveType } from '../utils/validation.js';

/**
 * LeaveService class handles all leave-related business logic
 * Provides methods for CRUD operations and leave management
 */
class LeaveService {
    /**
     * Apply for leave
     * @param {string} userId - User ID applying for leave
     * @param {Object} leaveData - Leave application data
     * @returns {Object} Created leave record
     * @throws {Error} If validation fails or dates are invalid
     */
    async applyLeave(userId, leaveData) {
        const { type, dateFrom, dateTo, reason } = leaveData;

        // Validate leave type
        if (!validateLeaveType(type)) {
            throw new Error('Invalid leave type');
        }

        // Validate dates
        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
        }

        if (startDate > endDate) {
            throw new Error('Start date cannot be after end date');
        }

        if (isPastDate(startDate)) {
            throw new Error('Cannot apply for leave on past dates');
        }

        // Check for overlapping leaves
        const overlappingLeave = await Leave.findOne({
            userId,
            status: { $in: ['pending', 'approved'] },
            $or: [
                { dateFrom: { $lte: endDate }, dateTo: { $gte: startDate } }
            ]
        });

        if (overlappingLeave) {
            throw new Error('You already have a leave application for overlapping dates');
        }

        // Calculate total days
        const totalDays = calculateTotalDays(startDate, endDate);

        const leave = await Leave.create({
            userId,
            type,
            dateFrom: startDate,
            dateTo: endDate,
            totalDays,
            reason: reason.trim()
        });

        return await Leave.findById(leave._id)
            .populate('userId', 'name email department');
    }

    /**
     * Get all leaves with filtering and pagination
     * @param {Object} filters - Filter criteria
     * @param {Object} pagination - Pagination options
     * @returns {Object} Leaves data with pagination info
     */
    async getAllLeaves(filters = {}, pagination = {}) {
        const { status, type, userId } = filters;
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;
        if (userId) query.userId = userId;

        const [leaves, total] = await Promise.all([
            Leave.find(query)
                .populate('userId', 'name email department')
                .populate('approvedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Leave.countDocuments(query)
        ]);

        return {
            leaves,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalLeaves: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    /**
     * Get user leaves with filtering
     * @param {string} userId - User ID
     * @param {Object} filters - Filter criteria
     * @returns {Object} User leaves data
     */
    async getUserLeaves(userId, filters = {}) {
        const { status, type } = filters;

        let query = { userId };
        if (status) query.status = status;
        if (type) query.type = type;

        const leaves = await Leave.find(query)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        return {
            count: leaves.length,
            leaves
        };
    }

    /**
     * Get leave by ID
     * @param {string} id - Leave ID
     * @returns {Object} Leave data
     * @throws {Error} If leave not found
     */
    async getLeaveById(id) {
        const leave = await Leave.findById(id)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email');

        if (!leave) {
            throw new Error('Leave not found');
        }

        return leave;
    }

    /**
     * Approve leave
     * @param {string} id - Leave ID
     * @param {string} approverId - ID of user approving the leave
     * @returns {Object} Updated leave data
     * @throws {Error} If leave not found or cannot be approved
     */
    async approveLeave(id, approverId) {
        const leave = await Leave.findById(id);
        if (!leave) {
            throw new Error('Leave not found');
        }

        if (leave.status !== 'pending') {
            throw new Error('Only pending leaves can be approved');
        }

        leave.status = 'approved';
        leave.approvedBy = approverId;
        leave.processedAt = new Date();

        const updatedLeave = await leave.save();
        return await Leave.findById(updatedLeave._id)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email');
    }

    /**
     * Reject leave
     * @param {string} id - Leave ID
     * @param {string} approverId - ID of user rejecting the leave
     * @param {string} rejectionReason - Reason for rejection
     * @returns {Object} Updated leave data
     * @throws {Error} If leave not found or cannot be rejected
     */
    async rejectLeave(id, approverId, rejectionReason) {
        const leave = await Leave.findById(id);
        if (!leave) {
            throw new Error('Leave not found');
        }

        if (leave.status !== 'pending') {
            throw new Error('Only pending leaves can be rejected');
        }

        leave.status = 'rejected';
        leave.approvedBy = approverId;
        leave.rejectionReason = rejectionReason || 'No reason provided';
        leave.processedAt = new Date();

        const updatedLeave = await leave.save();
        return await Leave.findById(updatedLeave._id)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email');
    }

    /**
     * Cancel leave
     * @param {string} id - Leave ID
     * @param {Object} user - User requesting cancellation
     * @returns {Object} Success message
     * @throws {Error} If leave not found or cannot be cancelled
     */
    async cancelLeave(id, user) {
        const leave = await Leave.findById(id);
        if (!leave) {
            throw new Error('Leave not found');
        }

        // Only allow cancellation if leave is pending, user owns the leave, or user is admin
        const canCancel = leave.status === 'pending' ||
                         leave.userId.toString() === user.id ||
                         user.role === 'admin';

        if (!canCancel) {
            throw new Error('You can only cancel your own pending leaves');
        }

        await Leave.findByIdAndDelete(id);
        return { message: 'Leave cancelled successfully' };
    }

    // Get leave balance
    async getLeaveBalance(userId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        const leaves = await Leave.find({
            userId,
            status: 'approved',
            dateFrom: { $gte: startDate, $lte: endDate }
        });

        const leaveBalance = {
            sick: { taken: 0, available: 10 },
            casual: { taken: 0, available: 12 },
            earned: { taken: 0, available: 15 }
        };

        leaves.forEach(leave => {
            if (leaveBalance[leave.type]) {
                leaveBalance[leave.type].taken += leave.totalDays;
            }
        });

        // Calculate remaining
        Object.keys(leaveBalance).forEach(type => {
            leaveBalance[type].remaining = Math.max(0, 
                leaveBalance[type].available - leaveBalance[type].taken
            );
        });

        return leaveBalance;
    }

    // Get leave statistics
    async getLeaveStats(filters = {}) {
        const { startDate, endDate, department } = filters;

        let matchQuery = {};
        if (startDate && endDate) {
            matchQuery.dateFrom = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ];

        if (department) {
            pipeline.push({
                $match: { 'user.department': department }
            });
        }

        pipeline.push({
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalDays: { $sum: '$totalDays' }
            }
        });

        return await Leave.aggregate(pipeline);
    }
}

export default new LeaveService();
