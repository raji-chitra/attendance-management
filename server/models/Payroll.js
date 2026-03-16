import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        employeeName: {
            type: String,
            required: true
        },
        month: {
            type: String, // 'YYYY-MM'
            required: true
        },
        basicSalary: {
            type: Number,
            required: true
        },
        allowances: {
            type: Number,
            default: 0
        },
        deductions: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        netSalary: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'cancelled'],
            default: 'pending'
        },
        paymentDate: {
            type: Date
        },
        paymentMethod: {
            type: String,
            enum: ['bank_transfer', 'cash', 'cheque'],
            default: 'bank_transfer'
        }
    },
    { timestamps: true }
);

payrollSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
