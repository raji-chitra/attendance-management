import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Search
} from '@mui/icons-material'
import { useTheme } from '../../contexts/ThemeContext'
import { employeeAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ManageEmployees = () => {
  const { colors } = useTheme()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    status: 'Active',
    employeeId: ''
  })

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeeAPI.getAll()
      setEmployees(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      toast.error('Failed to load employees')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations']
  const statuses = ['Active', 'On Leave', 'Inactive']

  const handleBack = () => {
    navigate(-1)
  }

  const handleAdd = () => {
    navigate('/admin/employees/new')
  }

  const handleEdit = (employee) => {
    navigate(`/admin/employees/edit/${employee.id || employee._id}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id)
        toast.success('Employee deleted successfully')
        loadEmployees()
      } catch (error) {
        console.error('Failed to delete employee:', error)
        toast.error('Failed to delete employee')
      }
    }
  }



  const filteredEmployees = employees.filter(emp =>
    (emp.name && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.employeeId && emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success'
      case 'On Leave': return 'warning'
      case 'Inactive': return 'error'
      default: return 'default'
    }
  }

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{
        background: colors.header.gradient,
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={handleBack}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Employees
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              View and manage organization staff records
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            bgcolor: 'white',
            color: colors.primary.main,
            fontWeight: 600,
            '&:hover': { bgcolor: '#f5f5f5' },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {employees.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {employees.filter(emp => emp.status === 'Active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {employees.filter(emp => emp.status === 'On Leave').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Leave
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {employees.filter(emp => emp.status === 'Inactive').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactive
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search employees by name, email, department, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employee List
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id || employee._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: colors.primary.main }} src={employee.avatar}>
                              {getInitials(employee.name)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {employee.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {employee.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{employee.employeeId || 'N/A'}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>
                          <Chip
                            label={employee.status}
                            color={getStatusColor(employee.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(employee)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(employee.id || employee._id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No employees found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>


    </Box>
  )
}

export default ManageEmployees
