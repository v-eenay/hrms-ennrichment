import { mongoose } from "mongoose";

const attendanceSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        clockIn: {
            type: Date
        },
        clockOut: {
            type: Date
        },
        totalHours: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'half-day', 'leave'],
            default: 'absent'
        },
        notes: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

// Create indexes for better performance
attendanceSchema.index({ userId: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
