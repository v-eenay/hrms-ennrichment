import { Department } from '../models/departmentModel.js';
import { User } from '../models/userModel.js';

/**
 * DepartmentService class handles all department-related business logic
 * Provides methods for CRUD operations and department management
 */
class DepartmentService {
    /**
     * Get all departments with optional filtering
     * @param {Object} filters - Filter criteria
     * @returns {Object} Departments data
     */
    async getAllDepartments(filters = {}) {
        const query = { isActive: true };
        
        const departments = await Department.find(query)
            .populate('head', 'name email designation')
            .sort({ name: 1 });

        // Get employee count for each department
        const departmentsWithCount = await Promise.all(
            departments.map(async (dept) => {
                const employeeCount = await User.countDocuments({ 
                    department: dept._id, 
                    isActive: true 
                });
                return {
                    ...dept.toObject(),
                    employeeCount
                };
            })
        );

        return {
            count: departmentsWithCount.length,
            departments: departmentsWithCount
        };
    }

    /**
     * Get department by ID
     * @param {string} id - Department ID
     * @returns {Object} Department data
     * @throws {Error} If department not found
     */
    async getDepartmentById(id) {
        const department = await Department.findById(id)
            .populate('head', 'name email designation phoneNumber');
        
        if (!department || !department.isActive) {
            throw new Error('Department not found');
        }

        // Get employee count and list
        const [employeeCount, employees] = await Promise.all([
            User.countDocuments({ department: id, isActive: true }),
            User.find({ department: id, isActive: true })
                .select('name email designation')
                .sort({ name: 1 })
        ]);

        return {
            ...department.toObject(),
            employeeCount,
            employees
        };
    }

    /**
     * Create new department
     * @param {Object} departmentData - Department data
     * @returns {Object} Created department data
     * @throws {Error} If department already exists or validation fails
     */
    async createDepartment(departmentData) {
        const { name, description, head, budget } = departmentData;

        // Check if department exists
        const departmentExists = await Department.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });
        if (departmentExists) {
            throw new Error('Department with this name already exists');
        }

        // Validate head if provided
        if (head) {
            const headUser = await User.findById(head);
            if (!headUser || !headUser.isActive) {
                throw new Error('Invalid department head selected');
            }
        }

        // Create department
        const department = await Department.create({
            name: name.trim(),
            description: description?.trim(),
            head,
            budget
        });

        return await Department.findById(department._id)
            .populate('head', 'name email designation');
    }

    /**
     * Update department
     * @param {string} id - Department ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated department data
     * @throws {Error} If department not found
     */
    async updateDepartment(id, updateData) {
        const department = await Department.findById(id);
        if (!department || !department.isActive) {
            throw new Error('Department not found');
        }

        // Check if name is being updated and already exists
        if (updateData.name && updateData.name !== department.name) {
            const nameExists = await Department.findOne({ 
                name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
                _id: { $ne: id }
            });
            if (nameExists) {
                throw new Error('Department name already exists');
            }
        }

        // Validate head if being updated
        if (updateData.head) {
            const headUser = await User.findById(updateData.head);
            if (!headUser || !headUser.isActive) {
                throw new Error('Invalid department head selected');
            }
        }

        // Update only provided fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                if (key === 'name' || key === 'description') {
                    department[key] = updateData[key].trim();
                } else {
                    department[key] = updateData[key];
                }
            }
        });

        const updatedDepartment = await department.save();
        return await Department.findById(updatedDepartment._id)
            .populate('head', 'name email designation');
    }

    /**
     * Delete department (soft delete by setting isActive to false)
     * @param {string} id - Department ID
     * @throws {Error} If department not found or has active employees
     */
    async deleteDepartment(id) {
        const department = await Department.findById(id);
        if (!department || !department.isActive) {
            throw new Error('Department not found');
        }

        // Check if department has active employees
        const employeeCount = await User.countDocuments({ 
            department: id, 
            isActive: true 
        });
        
        if (employeeCount > 0) {
            throw new Error(`Cannot delete department. It has ${employeeCount} active employee(s). Please reassign employees first.`);
        }

        // Soft delete by setting isActive to false
        department.isActive = false;
        await department.save();
        
        return { message: 'Department deactivated successfully' };
    }

    /**
     * Get department statistics
     * @returns {Object} Department statistics
     */
    async getDepartmentStats() {
        const [totalDepartments, activeDepartments, departmentEmployeeCounts] = await Promise.all([
            Department.countDocuments({}),
            Department.countDocuments({ isActive: true }),
            Department.aggregate([
                { $match: { isActive: true } },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'department',
                        as: 'employees'
                    }
                },
                {
                    $project: {
                        name: 1,
                        employeeCount: {
                            $size: {
                                $filter: {
                                    input: '$employees',
                                    cond: { $eq: ['$$this.isActive', true] }
                                }
                            }
                        }
                    }
                }
            ])
        ]);

        return {
            totalDepartments,
            activeDepartments,
            inactiveDepartments: totalDepartments - activeDepartments,
            departmentEmployeeCounts
        };
    }
}

export default new DepartmentService();
