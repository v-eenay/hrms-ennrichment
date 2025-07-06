import { Leave } from '../models/leaveModel.js';

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
export const applyLeave = async (req, res) => {
    try {
        const { type, dateFrom, dateTo, reason } = req.body;
        const userId = req.user.id;

        // Calculate total days
        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

        const leave = await Leave.create({
            userId,
            type,
            dateFrom: startDate,
            dateTo: endDate,
            totalDays,
            reason
        });

        const populatedLeave = await Leave.findById(leave._id).populate('userId', 'name email');
        res.status(201).json(populatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all leaves
// @route   GET /api/leaves
// @access  Private/Admin
export const getLeaves = async (req, res) => {
    try {
        const { status, type, userId } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;
        if (userId) query.userId = userId;

        const leaves = await Leave.find(query)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            count: leaves.length,
            leaves
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user leaves
// @route   GET /api/leaves/user/:userId
// @access  Private
export const getUserLeaves = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, type } = req.query;

        let query = { userId };
        if (status) query.status = status;
        if (type) query.type = type;

        const leaves = await Leave.find(query)
            .populate('userId', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            count: leaves.length,
            leaves
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leave by ID
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveById = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id)
            .populate('userId', 'name email department')
            .populate('approvedBy', 'name email');

        if (leave) {
            res.json(leave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve leave
// @route   PUT /api/leaves/:id/approve
// @access  Private/Manager
export const approveLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            leave.status = 'approved';
            leave.approvedBy = req.user.id;
            leave.processedAt = new Date();

            const updatedLeave = await leave.save();
            const populatedLeave = await Leave.findById(updatedLeave._id)
                .populate('userId', 'name email')
                .populate('approvedBy', 'name email');

            res.json(populatedLeave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject leave
// @route   PUT /api/leaves/:id/reject
// @access  Private/Manager
export const rejectLeave = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            leave.status = 'rejected';
            leave.approvedBy = req.user.id;
            leave.rejectionReason = rejectionReason;
            leave.processedAt = new Date();

            const updatedLeave = await leave.save();
            const populatedLeave = await Leave.findById(updatedLeave._id)
                .populate('userId', 'name email')
                .populate('approvedBy', 'name email');

            res.json(populatedLeave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel leave
// @route   DELETE /api/leaves/:id
// @access  Private
export const cancelLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            // Only allow cancellation if leave is pending or by admin
            if (leave.status === 'pending' || req.user.role === 'admin') {
                await Leave.findByIdAndDelete(req.params.id);
                res.json({ message: 'Leave cancelled' });
            } else {
                res.status(400).json({ message: 'Cannot cancel approved/rejected leave' });
            }
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
