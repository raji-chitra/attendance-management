import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get performance data (Mocked based on attendance/tasks for now)
router.get('/performance', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const employees = await Employee.find({ isActive: true });
        
        // Enhance with some "performance" metrics
        const performanceRecords = employees.map(emp => {
            // In a real app, this would come from a Performance model
            // Here we generate it dynamically
            const hash = emp.name.length;
            const overallRating = (3.5 + (hash % 15) / 10).toFixed(1);
            
            return {
                id: emp._id,
                employeeId: emp.employeeId,
                name: emp.name,
                employeeName: emp.name,
                department: emp.department || 'General',
                position: emp.role || 'Staff',
                overallRating: parseFloat(overallRating),
                quality: parseFloat(((parseFloat(overallRating) + 0.2) % 5 || 4).toFixed(1)),
                productivity: parseFloat(((parseFloat(overallRating) - 0.1) % 5 || 4).toFixed(1)),
                teamwork: parseFloat(((parseFloat(overallRating) + 0.1) % 5 || 4).toFixed(1)),
                reviewPeriod: 'Jan 2026 - Mar 2026',
                reviewer: 'System Admin',
                strengths: ['Punctual', 'Team Player'],
                improvements: ['Technical Documentation'],
                goals: ['Learn New Tech Stack']
            };
        });

        res.json(performanceRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get detailed attendance report
router.get('/attendance', auth, requireRole('admin', 'hr'), async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;
        const query = {};
        if (employeeId) query.employeeId = employeeId;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }

        const data = await Attendance.find(query).sort({ date: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
