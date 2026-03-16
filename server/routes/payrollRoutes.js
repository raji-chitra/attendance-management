import express from 'express';
import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all payroll records (Admin/HR)
router.get('/', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { month } = req.query;
        const query = {};
        if (month) query.month = month;
        
        const payrolls = await Payroll.find(query).sort({ month: -1 });
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get my payroll history (Employee)
router.get('/my', auth, async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.user.email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        
        const payrolls = await Payroll.find({ employeeId: employee._id }).sort({ month: -1 });
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create/Generate payroll for a month
router.post('/generate', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { month } = req.body;
        if (!month) return res.status(400).json({ message: 'Month is required' });

        const employees = await Employee.find({ isActive: true });
        const results = [];

        for (const emp of employees) {
            // Check if payroll already exists for this employee and month
            const existing = await Payroll.findOne({ employeeId: emp._id, month });
            if (existing) continue;

            const basicSalary = emp.salary || 30000; // Default if not set
            const netSalary = basicSalary; // Simple calculation for now

            const payroll = await Payroll.create({
                employeeId: emp._id,
                employeeName: emp.name,
                month,
                basicSalary,
                netSalary,
                status: 'pending'
            });
            results.push(payroll);
        }

        res.status(201).json({ message: `Generated ${results.length} payroll records`, data: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payroll status (Approve/Pay)
router.patch('/:id/status', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { status, paymentMethod } = req.body;
        const update = { status };
        if (status === 'paid') {
            update.paymentDate = new Date();
            if (paymentMethod) update.paymentMethod = paymentMethod;
        }

        const payroll = await Payroll.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });
        
        res.json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
