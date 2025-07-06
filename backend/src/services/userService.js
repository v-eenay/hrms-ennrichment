import { User } from '../models/userModel.js';

class UserService {
    // Get all users
    async getAllUsers() {
        return await User.find({}).populate('department').select('-password');
    }

    // Get user by ID
    async getUserById(id) {
        const user = await User.findById(id).populate('department').select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // Create new user
    async createUser(userData) {
        const { name, email, password, role, department, designation, salary, phoneNumber } = userData;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('User already exists');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            designation,
            salary,
            phoneNumber
        });

        return await User.findById(user._id).populate('department').select('-password');
    }

    // Update user
    async updateUser(id, updateData) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Update fields
        user.name = updateData.name || user.name;
        user.email = updateData.email || user.email;
        user.role = updateData.role || user.role;
        user.department = updateData.department || user.department;
        user.designation = updateData.designation || user.designation;
        user.salary = updateData.salary || user.salary;
        user.phoneNumber = updateData.phoneNumber || user.phoneNumber;
        user.address = updateData.address || user.address;
        user.isActive = updateData.isActive !== undefined ? updateData.isActive : user.isActive;

        const updatedUser = await user.save();
        return await User.findById(updatedUser._id).populate('department').select('-password');
    }

    // Delete user
    async deleteUser(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        await User.findByIdAndDelete(id);
        return { message: 'User removed successfully' };
    }

    // Get users by department
    async getUsersByDepartment(departmentId) {
        return await User.find({ department: departmentId })
            .populate('department')
            .select('-password');
    }

    // Get users by role
    async getUsersByRole(role) {
        return await User.find({ role })
            .populate('department')
            .select('-password');
    }

    // Search users
    async searchUsers(searchTerm) {
        return await User.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { designation: { $regex: searchTerm, $options: 'i' } }
            ]
        }).populate('department').select('-password');
    }
}

export default new UserService();
