import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'

// Enhanced Components
import WorkingDashboard from './components/WorkingDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Role-specific Pages
import Performance from './pages/hr/Performance'
import PayrollManagement from './pages/admin/PayrollManagement'
import MyPayroll from './pages/employee/MyPayroll'

// Original Components
import MyTasks from './pages/employee/MyTasks'
import CheckInOutSimple from './pages/employee/CheckInOutSimple'
import MyLocation from './pages/employee/MyLocation'
import MyProfileSimple from './pages/employee/MyProfileSimple'
import ManageEmployees from './pages/admin/ManageEmployees'
import EmployeeList from './pages/employees/EmployeeList'
import EmployeeForm from './pages/employees/EmployeeForm'
import EmployeeProfile from './pages/employees/EmployeeProfile'

// Auth Pages
import LoginPortal from './pages/auth/LoginPortal'
import SignupPortal from './pages/auth/SignupPortal'
import AdminLogin from './pages/auth/AdminLogin'
import HRLogin from './pages/auth/HRLogin'
import EmployeeLogin from './pages/auth/EmployeeLogin'
import AdminSignup from './pages/auth/AdminSignup'
import HRSignup from './pages/auth/HRSignup'
import EmployeeSignup from './pages/auth/EmployeeSignup'

// HR Pages
import EmployeeRecords from './pages/hr/EmployeeRecords'
import AttendanceReports from './pages/hr/AttendanceReports'
import Analytics from './pages/hr/Analytics'
import HybridDashboard from './pages/dashboard/HybridDashboard'
import LeaveApplication from './pages/leave/LeaveApplication'
import TestLeave from './pages/leave/TestLeave'
import LeaveRequestDetails from './pages/leave/LeaveRequestDetails'
import TestLeaveRequests from './pages/leave/TestLeaveRequests'
import EmployeeAttendance from './pages/attendance/EmployeeAttendance'
import HRAttendance from './pages/attendance/HRAttendance'
import AdminLeaveManagement from './pages/admin/AdminLeaveManagement'

// Admin Pages
import SystemReports from './pages/admin/SystemReports'
import SystemSettings from './pages/admin/SystemSettings'
import UserManagement from './pages/admin/UserManagement'
import HybridPermissions from './pages/admin/HybridPermissions'
import ManagePermissions from './pages/admin/ManagePermissions'
import AdminServiceManagement from './pages/admin/AdminServiceManagement'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import ServiceDetails from './pages/services/ServiceDetails'
import LiveLocation from './pages/location/LiveLocation'
import NotificationsPage from './pages/notifications/Notifications'
import AttendanceDashboard from './pages/attendance/AttendanceDashboard'

function App() {
  return (
    <>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPortal />} />

        {/* Role-specific Login Routes */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/employee" element={<EmployeeLogin />} />

        {/* Workload Dashboard Route */}
        <Route path="/dashboard/:role" element={<ProtectedRoute><WorkingDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/hybrid" element={<ProtectedRoute><HybridDashboard /></ProtectedRoute>} />

        {/* Employee Routes */}
        <Route path="/employee/mytasks" element={<ProtectedRoute><ServiceList /></ProtectedRoute>} />
        <Route path="/employee/checkinout" element={<ProtectedRoute><CheckInOutSimple /></ProtectedRoute>} />
        <Route path="/employee/mylocation" element={<ProtectedRoute><MyLocation /></ProtectedRoute>} />
        <Route path="/employee/myprofile" element={<ProtectedRoute><MyProfileSimple /></ProtectedRoute>} />
        <Route path="/employee/leave-application" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />
        <Route path="/employee/leave-requests" element={<ProtectedRoute><TestLeaveRequests /></ProtectedRoute>} />
        <Route path="/employee/attendance" element={<ProtectedRoute><AttendanceDashboard /></ProtectedRoute>} />
        <Route path="/employee/payroll" element={<ProtectedRoute><MyPayroll /></ProtectedRoute>} />
        <Route path="/employee/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />

        {/* Aliases so quick-action paths work */}
        <Route path="/employee/location" element={<MyLocation />} />
        <Route path="/employee/profile" element={<MyProfileSimple />} />

        {/* Admin Routes */}
        <Route path="/admin/manage-employees" element={<AdminRoute><ManageEmployees /></AdminRoute>} />
        <Route path="/admin/employees" element={<AdminRoute><EmployeeList /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><SystemReports /></AdminRoute>} />
        <Route path="/admin/system-settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
        <Route path="/admin/user-management" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/attendance" element={<AdminRoute><HRAttendance /></AdminRoute>} />
        <Route path="/admin/leaves" element={<AdminRoute><AdminLeaveManagement /></AdminRoute>} />
        <Route path="/admin/payroll" element={<AdminRoute><PayrollManagement /></AdminRoute>} />
        <Route path="/admin/performance" element={<AdminRoute><Performance /></AdminRoute>} />
        <Route path="/admin/tasks" element={<AdminRoute><AdminServiceManagement /></AdminRoute>} />

        {/* Service Management Routes */}
        <Route path="/services" element={<ServiceList />} />
        <Route path="/services/:id" element={<ServiceDetails />} />

        {/* Admin employee/service CRUD routes */}
        <Route path="/admin/employees/new" element={<EmployeeForm />} />
        <Route path="/admin/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/admin/services" element={<AdminServiceManagement />} />
        <Route path="/admin/services/new" element={<ServiceForm />} />
        <Route path="/admin/services/edit/:id" element={<ServiceForm />} />
        <Route path="/admin/services/:id" element={<ServiceDetails />} />

        {/* Location Tracking Routes */}
        <Route path="/location/tracking" element={<LiveLocation />} />
        <Route path="/location/live" element={<LiveLocation />} />

        {/* Notification Routes */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/employee/notifications" element={<NotificationsPage />} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<div style={{ padding: '50px', textAlign: 'center' }}><h1>403 - Unauthorized Access</h1><p>You do not have permission to view this page.</p></div>} />

        {/* Home Route */}
        <Route path="/" element={<LoginPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
