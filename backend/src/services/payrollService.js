import { Payroll } from '../models/payrollModel.js';

class PayrollService {
    // Get all payrolls
    async getAllPayrolls(filters = {}) {
        const { month, year, userId } = filters;
        
        let query = {};
        if (month) query.month = month;
        if (year) query.year = parseInt(year);
        if (userId) query.userId = userId;

        return await Payroll.find(query)
            .populate('userId', 'name email department')
            .sort({ year: -1, month: -1 });
    }

    // Get user payroll
    async getUserPayroll(userId, filters = {}) {
        const { month, year } = filters;

        let query = { userId };
        if (month) query.month = month;
        if (year) query.year = parseInt(year);

        return await Payroll.find(query)
            .populate('userId', 'name email department')
            .sort({ year: -1, month: -1 });
    }

    // Create payroll
    async createPayroll(payrollData) {
        const { userId, month, year, basicSalary, allowances, deductions } = payrollData;

        // Check if payroll already exists for this user/month/year
        const existingPayroll = await Payroll.findOne({ userId, month, year });
        if (existingPayroll) {
            throw new Error('Payroll already exists for this period');
        }

        // Calculate totals
        const totalAllowances = this.calculateTotalAllowances(allowances);
        const totalDeductions = this.calculateTotalDeductions(deductions);
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

        return await Payroll.findById(payroll._id).populate('userId', 'name email department');
    }

    // Update payroll
    async updatePayroll(id, updateData) {
        const payroll = await Payroll.findById(id);
        if (!payroll) {
            throw new Error('Payroll not found');
        }

        payroll.basicSalary = updateData.basicSalary || payroll.basicSalary;
        payroll.allowances = updateData.allowances || payroll.allowances;
        payroll.deductions = updateData.deductions || payroll.deductions;
        payroll.paymentStatus = updateData.paymentStatus || payroll.paymentStatus;

        if (updateData.paymentStatus === 'paid' && !payroll.paymentDate) {
            payroll.paymentDate = new Date();
        }

        // Recalculate totals
        payroll.totalAllowances = this.calculateTotalAllowances(payroll.allowances);
        payroll.totalDeductions = this.calculateTotalDeductions(payroll.deductions);
        payroll.grossSalary = payroll.basicSalary + payroll.totalAllowances;
        payroll.netSalary = payroll.grossSalary - payroll.totalDeductions;

        const updatedPayroll = await payroll.save();
        return await Payroll.findById(updatedPayroll._id).populate('userId', 'name email department');
    }

    // Get pay slip
    async getPaySlip(id) {
        const payroll = await Payroll.findById(id)
            .populate('userId', 'name email department designation');

        if (!payroll) {
            throw new Error('Payroll not found');
        }

        return payroll;
    }

    // Delete payroll
    async deletePayroll(id) {
        const payroll = await Payroll.findById(id);
        if (!payroll) {
            throw new Error('Payroll not found');
        }

        await Payroll.findByIdAndDelete(id);
        return { message: 'Payroll removed successfully' };
    }

    // Generate payroll for all employees
    async generateMonthlyPayroll(month, year) {
        const { User } = require('../models/userModel.js');
        const activeUsers = await User.find({ isActive: true, role: { $ne: 'admin' } });

        const generatedPayrolls = [];

        for (const user of activeUsers) {
            try {
                // Check if payroll already exists
                const existingPayroll = await Payroll.findOne({
                    userId: user._id,
                    month,
                    year
                });

                if (!existingPayroll) {
                    const payroll = await this.createPayroll({
                        userId: user._id,
                        month,
                        year,
                        basicSalary: user.salary || 0,
                        allowances: {},
                        deductions: {}
                    });
                    generatedPayrolls.push(payroll);
                }
            } catch (error) {
                console.error(`Error generating payroll for user ${user._id}:`, error);
            }
        }

        return generatedPayrolls;
    }

    // Calculate payroll summary
    async getPayrollSummary(month, year) {
        const payrolls = await Payroll.find({ month, year })
            .populate('userId', 'name department');

        const summary = {
            totalEmployees: payrolls.length,
            totalGrossSalary: 0,
            totalDeductions: 0,
            totalNetSalary: 0,
            paidCount: 0,
            pendingCount: 0
        };

        payrolls.forEach(payroll => {
            summary.totalGrossSalary += payroll.grossSalary;
            summary.totalDeductions += payroll.totalDeductions;
            summary.totalNetSalary += payroll.netSalary;

            if (payroll.paymentStatus === 'paid') {
                summary.paidCount++;
            } else {
                summary.pendingCount++;
            }
        });

        return summary;
    }

    // Helper methods
    calculateTotalAllowances(allowances) {
        if (!allowances) return 0;
        return Object.values(allowances).reduce((sum, val) => sum + (val || 0), 0);
    }

    calculateTotalDeductions(deductions) {
        if (!deductions) return 0;
        return Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
    }
}

export default new PayrollService();
