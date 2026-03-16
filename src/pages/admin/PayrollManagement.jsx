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
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress
} from '@mui/material'
import {
  Payments,
  Add,
  CheckCircle,
  AccountBalance,
  Receipt
} from '@mui/icons-material'
import { payrollAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'
import { useTheme } from '../../contexts/ThemeContext'

const PayrollManagement = () => {
  const { colors } = useTheme()
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [genDialogOpen, setGenDialogOpen] = useState(false)
  const [monthToGen, setMonthToGen] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetchPayrolls()
  }, [])

  const fetchPayrolls = async () => {
    try {
      setLoading(true)
      const res = await payrollAPI.getAll()
      setPayrolls(res.data || [])
    } catch (error) {
      toast.error('Failed to load payrolls')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      await payrollAPI.generate({ month: monthToGen })
      toast.success('Payroll generated successfully')
      setGenDialogOpen(false)
      fetchPayrolls()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed')
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await payrollAPI.updateStatus(id, { status })
      toast.success(`Payroll marked as ${status}`)
      fetchPayrolls()
    } catch (error) {
      toast.error('Udpate failed')
    }
  }

  return (
    <DashboardLayout title="Payroll Management">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Company Payroll</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setGenDialogOpen(true)}
          sx={{ bgcolor: colors.primary.main }}
        >
          Generate Monthly Payroll
        </Button>
      </Box>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>Net Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
                ) : payrolls.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>No payroll records found</TableCell></TableRow>
                ) : payrolls.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell fontWeight={600}>{row.employeeName}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>₹{row.basicSalary?.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: colors.primary.main }}>₹{row.netSalary?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status.toUpperCase()} 
                        color={row.status === 'paid' ? 'success' : 'warning'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {row.status !== 'paid' && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<CheckCircle />}
                          onClick={() => handleUpdateStatus(row.id, 'paid')}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={genDialogOpen} onClose={() => setGenDialogOpen(false)}>
        <DialogTitle>Generate Monthly Payroll</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            type="month"
            label="Target Month"
            value={monthToGen}
            onChange={(e) => setMonthToGen(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will create payroll entries for all active employees for the selected month.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleGenerate} variant="contained">Generate</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

export default PayrollManagement
