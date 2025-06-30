import { mongoose } from "mongoose";

const employeeSchema = mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
        hireDate: {
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                    return value <= new Date();
                },
                message: 'Hire date cannot be in the future'
            }
        },
        salary: {
            type: Number,
            required: true,
            min: [0, 'Salary must be a positive number'],
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

// Create indexes for better performance
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

export const Employee = mongoose.model("Employee", employeeSchema);
