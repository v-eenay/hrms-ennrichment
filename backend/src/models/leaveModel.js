import { mongoose } from "mongoose";

const leaveSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['sick', 'casual', 'earned', 'maternity', 'paternity'],
            required: true
        },
        dateFrom: {
            type: Date,
            required: true
        },
        dateTo: {
            type: Date,
            required: true
        },
        totalDays: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rejectionReason: {
            type: String
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        processedAt: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

// Create indexes for better performance
leaveSchema.index({ userId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ type: 1 });

export const Leave = mongoose.model("Leave", leaveSchema);
