import { User } from '../models/userModel.js';
import fileService from './fileService.js';

/**
 * UserService class handles all user-related business logic
 * Provides methods for CRUD operations and user management
 */
class UserService {
    /**
     * Get all users with optional filtering and pagination
     * @param {Object} filters - Filter criteria (role, department, etc.)
     * @param {Object} options - Pagination options (page, limit)
     * @returns {Object} Users data with pagination info
     */
    async getAllUsers(filters = {}, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        // Build query based on filters
        const query = { isActive: true };
        if (filters.role) query.role = filters.role;
        if (filters.department) query.department = filters.department;

        const [users, total] = await Promise.all([
            User.find(query)
                .populate('department', 'name description')
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        return {
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Object} User data
     * @throws {Error} If user not found
     */
    async getUserById(id) {
        const user = await User.findById(id)
            .populate('department', 'name description')
            .select('-password');

        if (!user || !user.isActive) {
            throw new Error('User not found');
        }
        return user;
    }

    /**
     * Create new user
     * @param {Object} userData - User data
     * @returns {Object} Created user data
     * @throws {Error} If user already exists or validation fails
     */
    async createUser(userData) {
        const { name, email, password, role, department, designation, salary, phoneNumber, address } = userData;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('User with this email already exists');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'employee',
            department,
            designation,
            salary,
            phoneNumber,
            address
        });

        return await User.findById(user._id)
            .populate('department', 'name description')
            .select('-password');
    }

    /**
     * Update user
     * @param {string} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated user data
     * @throws {Error} If user not found
     */
    async updateUser(id, updateData) {
        const user = await User.findById(id);
        if (!user || !user.isActive) {
            throw new Error('User not found');
        }

        // Check if email is being updated and already exists
        if (updateData.email && updateData.email !== user.email) {
            const emailExists = await User.findOne({ email: updateData.email });
            if (emailExists) {
                throw new Error('Email already exists');
            }
        }

        // Update only provided fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                user[key] = updateData[key];
            }
        });

        const updatedUser = await user.save();
        return await User.findById(updatedUser._id)
            .populate('department', 'name description')
            .select('-password');
    }

    /**
     * Delete user (soft delete by setting isActive to false)
     * @param {string} id - User ID
     * @throws {Error} If user not found
     */
    async deleteUser(id) {
        const user = await User.findById(id);
        if (!user || !user.isActive) {
            throw new Error('User not found');
        }

        // Soft delete by setting isActive to false
        user.isActive = false;
        await user.save();

        return { message: 'User deactivated successfully' };
    }

    /**
     * Get users by department
     * @param {string} departmentId - Department ID
     * @returns {Object} Users in the department
     */
    async getUsersByDepartment(departmentId) {
        const users = await User.find({
            department: departmentId,
            isActive: true
        })
            .populate('department', 'name description')
            .select('-password')
            .sort({ name: 1 });

        return {
            count: users.length,
            users
        };
    }

    /**
     * Get users by role
     * @param {string} role - User role
     * @returns {Array} Users with the specified role
     */
    async getUsersByRole(role) {
        return await User.find({ role, isActive: true })
            .populate('department', 'name description')
            .select('-password')
            .sort({ name: 1 });
    }

    /**
     * Search users by name, email, or designation
     * @param {string} searchTerm - Search term
     * @returns {Array} Matching users
     */
    async searchUsers(searchTerm) {
        return await User.find({
            isActive: true,
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { designation: { $regex: searchTerm, $options: 'i' } }
            ]
        })
            .populate('department', 'name description')
            .select('-password')
            .sort({ name: 1 });
    }

    /**
     * Upload profile picture for user
     * @param {string} userId - User ID
     * @param {Object} file - Uploaded file object
     * @param {Object} req - Express request object
     * @returns {Object} Updated user data
     * @throws {Error} If user not found or upload fails
     */
    async uploadProfilePicture(userId, file, req) {
        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            throw new Error('User not found');
        }

        // Delete existing profile picture if it exists
        if (user.hasProfilePicture()) {
            await fileService.deleteProfilePicture(user.profilePicture);
        }

        // Process and save new profile picture
        const processedFile = await fileService.processProfilePicture(file, req);

        // Update user with new profile picture data
        user.updateProfilePicture({
            path: processedFile.original.path,
            url: processedFile.original.url,
            filename: processedFile.original.filename
        });

        await user.save();

        return await User.findById(user._id)
            .populate('department', 'name description')
            .select('-password');
    }

    /**
     * Remove profile picture for user
     * @param {string} userId - User ID
     * @returns {Object} Updated user data
     * @throws {Error} If user not found
     */
    async removeProfilePicture(userId) {
        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            throw new Error('User not found');
        }

        // Delete profile picture files
        if (user.hasProfilePicture()) {
            await fileService.deleteProfilePicture(user.profilePicture);
        }

        // Remove profile picture data from user
        user.removeProfilePicture();
        await user.save();

        return await User.findById(user._id)
            .populate('department', 'name description')
            .select('-password');
    }

    /**
     * Get profile picture information for user
     * @param {string} userId - User ID
     * @param {Object} req - Express request object
     * @returns {Object} Profile picture information
     * @throws {Error} If user not found
     */
    async getProfilePictureInfo(userId, req) {
        const user = await User.findById(userId).select('profilePicture');
        if (!user || !user.isActive) {
            throw new Error('User not found');
        }

        if (!user.hasProfilePicture()) {
            return null;
        }

        return fileService.getProfilePictureInfo(user.profilePicture.path, req);
    }

    /**
     * Get user statistics
     * @returns {Object} User statistics
     */
    async getUserStats() {
        const [totalUsers, activeUsers, usersByRole] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ isActive: true }),
            User.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ])
        ]);

        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            usersByRole: usersByRole.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        };
    }
}

export default new UserService();
