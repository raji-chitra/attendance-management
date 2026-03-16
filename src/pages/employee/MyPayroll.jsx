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
  Button
} from '@mui/material'
import { Receipt } from '@mui/icons-material'
import { payrollAPI } from '../../services/api'
import DashboardLayout from '../../components/DashboardLayout'
import { useTheme } from '../../contexts/ThemeContext'

const MyPayroll = () => {
  const { colors } = useTheme()
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyPayroll()
  }, [])

  const fetchMyPayroll = async () => {
    try {
      setLoading(true)
      const res = await payrollAPI.getMyPayroll()
      setPayrolls(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="My Payroll & Payslips">
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Payment History</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell align="right">Payslip</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.month}</TableCell>
                    <TableCell>₹{row.netSalary?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status.toUpperCase()} 
                        color={row.status === 'paid' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell align="right">
                      <Button startIcon={<Receipt />} size="small">Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {payrolls.length === 0 && !loading && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default MyPayroll
