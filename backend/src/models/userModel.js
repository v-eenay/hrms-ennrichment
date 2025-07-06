import { mongoose } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'employee'],
            default: 'employee'
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        },
        designation: {
            type: String,
            trim: true
        },
        salary: {
            type: Number,
            min: 0
        },
        profileImage: {
            type: String
        },
        phoneNumber: {
            type: String,
            match: /^\d{10,15}$/
        },
        address: {
            type: String
        },
        dateOfJoining: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create indexes for better performance (email index is automatic due to unique: true)
userSchema.index({ department: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export const User = mongoose.model("User", userSchema);
