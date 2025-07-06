import { User } from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

class AuthService {
    // Register new user
    async register(userData) {
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

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        };
    }

    // Login user
    async login(email, password) {
        // Check for user email
        const user = await User.findOne({ email }).populate('department');
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token: generateToken(user._id)
        };
    }

    // Get user profile
    async getProfile(userId) {
        const user = await User.findById(userId).populate('department').select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update fields
        user.name = updateData.name || user.name;
        user.email = updateData.email || user.email;
        user.phoneNumber = updateData.phoneNumber || user.phoneNumber;
        user.address = updateData.address || user.address;
        
        if (updateData.password) {
            user.password = updateData.password;
        }
        
        const updatedUser = await user.save();
        
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        };
    }
}

export default new AuthService();
