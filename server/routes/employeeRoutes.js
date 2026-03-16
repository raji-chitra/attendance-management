import express from 'express';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { auth as protect, requireRole as authorize } from '../middleware/auth.js';

const router = express.Router();

// GET all employees
router.get('/', protect, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single employee
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create employee (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role, department, designation, employeeId, phone, branchName } = req.body;

    // 1. Create/Update Employee record
    const employee = await Employee.findOneAndUpdate(
      { email },
      {
        name,
        email,
        role: role || 'employee',
        department: department || 'Operations',
        designation: designation || 'Employee',
        phone: phone || '',
        employeeId: employeeId || `EMP${Date.now().toString().slice(-5)}`,
        isActive: true,
        joinDate: new Date().toISOString().split('T')[0],
        branchName: branchName || '',
      },
      { upsert: true, new: true }
    );

    // 2. Create/Update User record for authentication
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { email },
        {
          name,
          email,
          password: hashedPassword,
          role: role || 'employee',
          status: 'active',
          department: department || '',
          employeeId: employee.employeeId,
          phone: phone || '',
          branchName: branchName || '',
        },
        { upsert: true }
      );
    }

    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update employee
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH toggle status
router.patch('/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    employee.isActive = !employee.isActive;
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE employee
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
