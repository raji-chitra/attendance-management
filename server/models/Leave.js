import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        employeeName: {
            type: String,
            required: true,
        },
        leaveType: {
            type: String,
            required: [true, 'Leave type is required'],
            enum: ['annual', 'sick', 'personal', 'permission', 'maternity', 'paternity', 'emergency', 'bereavement', 'compensatory', 'casual', 'vacation', 'other'],
        },
        startTime: String,
        endTime: String,
        isHalfDay: {
            type: Boolean,
            default: false
        },
        days: {
            type: Number,
            required: true
        },
        emergencyContact: String,
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        reason: {
            type: String,
            required: [true, 'Reason is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedByName: {
            type: String,
        },
        rejectionReason: {
            type: String,
        },
        appliedDate: {
            type: String,
            default: () => new Date().toISOString().split('T')[0],
        },
    },
    {
        timestamps: true,
    }
);

leaveSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
