import { mongoose } from "mongoose";

const departmentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        head: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        budget: {
            type: Number,
            min: 0
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

// Create indexes for better performance
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });

export const Department = mongoose.model("Department", departmentSchema);
