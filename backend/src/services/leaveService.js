import { Leave } from '../models/leaveModel.js';
import { calculateTotalDays } from '../utils/dateUtils.js';

class LeaveService {
    // Apply for leave
    async applyLeave(userId, leaveData) {
        const { type, dateFrom, dateTo, reason } = leaveData;

        // Calculate total days
        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);
        const totalDays = calculateTotalDays(startDate, endDate);

        const leave = await Leave.create({
            userId,
            type,
            dateFrom: startDate,
            dateTo: endDate,
            totalDays,
            reason
        });

        return await Leave.findById(leave._id).populate('userId', 'name email');
    }

    // Get all leaves
    async getAllLeaves(filters = {}) {
        const { status, type, userId } = filters;
        
        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;
        if (userId) query.userId = userId;

        return await Leave.find(query)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });
    }

    // Get user leaves
    async getUserLeaves(userId, filters = {}) {
        const { status, type } = filters;

        let query = { userId };
        if (status) query.status = status;
        if (type) query.type = type;

        return await Leave.find(query)
            .populate('userId', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });
    }

    // Get leave by ID
    async getLeaveById(id) {
        const leave = await Leave.findById(id)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email');

        if (!leave) {
            throw new Error('Leave not found');
        }

        return leave;
    }

    // Approve leave
    async approveLeave(id, approverId) {
        const leave = await Leave.findById(id);
        if (!leave) {
            throw new Error('Leave not found');
        }

        leave.status = 'approved';
        leave.approvedBy = approverId;
        leave.processedAt = new Date();

        const updatedLeave = await leave.save();
        return await Leave.findById(updatedLeave._id)
            .populate('userId', 'name email')
            .populate('approvedBy', 'name email');
    }

    // Reject leave
    async rejectLeave(id, approverId, rejectionReason) {
        const leave = await Leave.findById(id);
        if (!leave) {
            throw new Error('Leave not found');
        }

        leave.status = 'rejected';
        leave.approvedBy = approverId;
        leave.rejectionReason = rejectionReason;
        leave.processedAt = new Date();

        const updatedLeave = await leave.save();
        return await Leave.findById(updatedLeave._id)
            .populate('userId', 'name email')
            .populate('approvedBy', 'name email');
    }

    // Cancel leave
    async cancelLeave(id, userRole) {
        const leave = await Leave.findById(id);
        if (!leave) {
            throw new Error('Leave not found');
        }

        // Only allow cancellation if leave is pending or by admin
        if (leave.status === 'pending' || userRole === 'admin') {
            await Leave.findByIdAndDelete(id);
            return { message: 'Leave cancelled successfully' };
        } else {
            throw new Error('Cannot cancel approved/rejected leave');
        }
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
