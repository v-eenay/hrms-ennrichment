import { Payroll } from '../models/payrollModel.js';
import { validateSalary } from '../utils/validation.js';

/**
 * PayrollService class handles all payroll-related business logic
 * Provides methods for CRUD operations and payroll management
 */
class PayrollService {
    /**
     * Get all payrolls with filtering and pagination
     * @param {Object} filters - Filter criteria
     * @param {Object} pagination - Pagination options
     * @returns {Object} Payrolls data with pagination info
     */
    async getAllPayrolls(filters = {}, pagination = {}) {
        const { month, year, userId } = filters;
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        let query = {};
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);
        if (userId) query.userId = userId;

        const [payrolls, total] = await Promise.all([
            Payroll.find(query)
                .populate('userId', 'name email department designation')
                .sort({ year: -1, month: -1 })
                .skip(skip)
                .limit(limit),
            Payroll.countDocuments(query)
        ]);

        return {
            payrolls,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPayrolls: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    /**
     * Get user payroll records
     * @param {string} userId - User ID
     * @param {Object} filters - Filter criteria
     * @returns {Object} User payroll data
     */
    async getUserPayroll(userId, filters = {}) {
        const { month, year } = filters;

        let query = { userId };
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);

        const payrolls = await Payroll.find(query)
            .populate('userId', 'name email department designation')
            .sort({ year: -1, month: -1 });

        return {
            count: payrolls.length,
            payrolls
        };
    }

    /**
     * Create payroll record
     * @param {Object} payrollData - Payroll data
     * @returns {Object} Created payroll record
     * @throws {Error} If payroll already exists or validation fails
     */
    async createPayroll(payrollData) {
        const { userId, month, year, basicSalary, allowances, deductions } = payrollData;

        // Validate basic salary
        const salaryValidation = validateSalary(basicSalary);
        if (!salaryValidation.isValid) {
            throw new Error(salaryValidation.message);
        }

        // Validate month and year
        if (month < 1 || month > 12) {
            throw new Error('Month must be between 1 and 12');
        }

        const currentYear = new Date().getFullYear();
        if (year < currentYear - 5 || year > currentYear + 1) {
            throw new Error('Year must be within reasonable range');
        }

        // Check if payroll already exists for this user/month/year
        const existingPayroll = await Payroll.findOne({ userId, month: parseInt(month), year: parseInt(year) });
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
            month: parseInt(month),
            year: parseInt(year),
            basicSalary,
            allowances: allowances || {},
            deductions: deductions || {},
            totalAllowances,
            totalDeductions,
            grossSalary,
            netSalary
        });

        return await Payroll.findById(payroll._id)
            .populate('userId', 'name email department designation');
    }

    /**
     * Update payroll record
     * @param {string} id - Payroll ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated payroll record
     * @throws {Error} If payroll not found
     */
    async updatePayroll(id, updateData) {
        const payroll = await Payroll.findById(id);
        if (!payroll) {
            throw new Error('Payroll not found');
        }

        // Validate basic salary if being updated
        if (updateData.basicSalary) {
            const salaryValidation = validateSalary(updateData.basicSalary);
            if (!salaryValidation.isValid) {
                throw new Error(salaryValidation.message);
            }
        }

        // Update only provided fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                payroll[key] = updateData[key];
            }
        });

        // Set payment date if status changed to paid
        if (updateData.paymentStatus === 'paid' && !payroll.paymentDate) {
            payroll.paymentDate = new Date();
        }

        // Recalculate totals
        payroll.totalAllowances = this.calculateTotalAllowances(payroll.allowances);
        payroll.totalDeductions = this.calculateTotalDeductions(payroll.deductions);
        payroll.grossSalary = payroll.basicSalary + payroll.totalAllowances;
        payroll.netSalary = payroll.grossSalary - payroll.totalDeductions;

        const updatedPayroll = await payroll.save();
        return await Payroll.findById(updatedPayroll._id)
            .populate('userId', 'name email department designation');
    }

    /**
     * Get pay slip by ID
     * @param {string} id - Payroll ID
     * @returns {Object} Pay slip data
     * @throws {Error} If payroll not found
     */
    async getPaySlip(id) {
        const payroll = await Payroll.findById(id)
            .populate('userId', 'name email department designation phoneNumber');

        if (!payroll) {
            throw new Error('Payroll not found');
        }

        return payroll;
    }

    /**
     * Delete payroll record
     * @param {string} id - Payroll ID
     * @returns {Object} Success message
     * @throws {Error} If payroll not found
     */
    async deletePayroll(id) {
        const payroll = await Payroll.findById(id);
        if (!payroll) {
            throw new Error('Payroll not found');
        }

        // Check if payroll is already paid
        if (payroll.paymentStatus === 'paid') {
            throw new Error('Cannot delete paid payroll records');
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
