import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Avatar,
  CircularProgress
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  ArrowBack
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { leaveAPI, employeeAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useTheme } from '../../contexts/ThemeContext'

const AdminLeaveManagement = () => {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [leavesRes, employeesRes] = await Promise.all([
        leaveAPI.getAll(),
        employeeAPI.getAll()
      ])
      setLeaves(leavesRes.data.data || leavesRes.data || [])
      setEmployees(employeesRes.data.data || employeesRes.data || [])
    } catch (error) {
      console.error('Failed to fetch leaves:', error)
      toast.error('Failed to load leave requests')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await leaveAPI.updateStatus(id, { status })
      toast.success(`Leave request ${status} successfully`)
      fetchData() // Refresh list
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id || e._id === id)
    return emp ? emp.name : 'Unknown Employee'
  }

  return (
    <DashboardLayout title="Leave Requests">
      {/* Header */}
      <Box sx={{
        background: colors.header.gradient,
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard/admin')}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Leave Management
          </Typography>
        </Box>
      </Box>

      <Box px={3}>
        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 2 }}>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          No leave requests found.
                        </TableCell>
                      </TableRow>
                    ) : leaves.map((leave) => (
                      <TableRow key={leave._id || leave.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: colors.primary.main, width: 32, height: 32 }}>
                              {(leave.employeeName || getEmployeeName(leave.employeeId)).charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {leave.employeeName || getEmployeeName(leave.employeeId)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{leave.leaveType || leave.type}</TableCell>
                        <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {leave.reason}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={leave.status} 
                            color={getStatusColor(leave.status)} 
                            size="small" 
                            sx={{ fontWeight: 'bold', textTransform: 'capitalize' }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {leave.status === 'pending' ? (
                            <Box display="flex" gap={1} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => handleUpdateStatus(leave._id || leave.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => handleUpdateStatus(leave._id || leave.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Processed
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  )
}

export default AdminLeaveManagement
