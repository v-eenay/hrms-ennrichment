import { Payroll } from '../models/payrollModel.js';

// @desc    Get all payrolls
// @route   GET /api/payroll
// @access  Private/Admin
export const getPayrolls = async (req, res) => {
    try {
        const { month, year, userId } = req.query;
        
        let query = {};
        if (month) query.month = month;
        if (year) query.year = parseInt(year);
        if (userId) query.userId = userId;

        const payrolls = await Payroll.find(query)
            .populate('userId', 'name email department')
            .sort({ year: -1, month: -1 });

        res.json({
            count: payrolls.length,
            payrolls
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user payroll
// @route   GET /api/payroll/user/:userId
// @access  Private
export const getUserPayroll = async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;

        let query = { userId };
        if (month) query.month = month;
        if (year) query.year = parseInt(year);

        const payrolls = await Payroll.find(query)
            .populate('userId', 'name email department')
            .sort({ year: -1, month: -1 });

        res.json({
            count: payrolls.length,
            payrolls
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create payroll
// @route   POST /api/payroll
// @access  Private/Admin
export const createPayroll = async (req, res) => {
    try {
        const { userId, month, year, basicSalary, allowances, deductions } = req.body;

        // Check if payroll already exists for this user/month/year
        const existingPayroll = await Payroll.findOne({ userId, month, year });
        if (existingPayroll) {
            return res.status(400).json({ message: 'Payroll already exists for this period' });
        }

        // Calculate totals
        const totalAllowances = Object.values(allowances || {}).reduce((sum, val) => sum + (val || 0), 0);
        const totalDeductions = Object.values(deductions || {}).reduce((sum, val) => sum + (val || 0), 0);
        const grossSalary = basicSalary + totalAllowances;
        const netSalary = grossSalary - totalDeductions;

        const payroll = await Payroll.create({
            userId,
            month,
            year,
            basicSalary,
            allowances: allowances || {},
            deductions: deductions || {},
            totalAllowances,
            totalDeductions,
            grossSalary,
            netSalary
        });

        const populatedPayroll = await Payroll.findById(payroll._id).populate('userId', 'name email department');
        res.status(201).json(populatedPayroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payroll
// @route   PUT /api/payroll/:id
// @access  Private/Admin
export const updatePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);

        if (payroll) {
            payroll.basicSalary = req.body.basicSalary || payroll.basicSalary;
            payroll.allowances = req.body.allowances || payroll.allowances;
            payroll.deductions = req.body.deductions || payroll.deductions;
            payroll.paymentStatus = req.body.paymentStatus || payroll.paymentStatus;

            if (req.body.paymentStatus === 'paid' && !payroll.paymentDate) {
                payroll.paymentDate = new Date();
            }

            // Recalculate totals
            payroll.totalAllowances = Object.values(payroll.allowances).reduce((sum, val) => sum + (val || 0), 0);
            payroll.totalDeductions = Object.values(payroll.deductions).reduce((sum, val) => sum + (val || 0), 0);
            payroll.grossSalary = payroll.basicSalary + payroll.totalAllowances;
            payroll.netSalary = payroll.grossSalary - payroll.totalDeductions;

            const updatedPayroll = await payroll.save();
            const populatedPayroll = await Payroll.findById(updatedPayroll._id).populate('userId', 'name email department');
            res.json(populatedPayroll);
        } else {
            res.status(404).json({ message: 'Payroll not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pay slip
// @route   GET /api/payroll/slip/:id
// @access  Private
export const getPaySlip = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id)
            .populate('userId', 'name email department designation');

        if (payroll) {
            res.json(payroll);
        } else {
            res.status(404).json({ message: 'Payroll not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete payroll
// @route   DELETE /api/payroll/:id
// @access  Private/Admin
export const deletePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);

        if (payroll) {
            await Payroll.findByIdAndDelete(req.params.id);
            res.json({ message: 'Payroll removed' });
        } else {
            res.status(404).json({ message: 'Payroll not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
