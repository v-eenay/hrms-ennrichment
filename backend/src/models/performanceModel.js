import { mongoose } from "mongoose";

const performanceSchema = mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reviewPeriod: {
            from: { type: Date, required: true },
            to: { type: Date, required: true }
        },
        goals: [{
            title: { type: String, required: true },
            description: { type: String },
            status: { 
                type: String, 
                enum: ['not-started', 'in-progress', 'completed', 'cancelled'],
                default: 'not-started'
            },
            completionDate: { type: Date }
        }],
        ratings: {
            communication: { type: Number, min: 1, max: 5 },
            teamwork: { type: Number, min: 1, max: 5 },
            leadership: { type: Number, min: 1, max: 5 },
            technical: { type: Number, min: 1, max: 5 },
            overall: { type: Number, min: 1, max: 5 }
        },
        feedback: {
            strengths: { type: String },
            improvements: { type: String },
            comments: { type: String }
        },
        status: {
            type: String,
            enum: ['draft', 'submitted', 'approved', 'rejected'],
            default: 'draft'
        }
    },
    {
        timestamps: true,
    }
);

// Create indexes for better performance
performanceSchema.index({ employeeId: 1 });
performanceSchema.index({ reviewerId: 1 });
performanceSchema.index({ status: 1 });

export const Performance = mongoose.model("Performance", performanceSchema);
