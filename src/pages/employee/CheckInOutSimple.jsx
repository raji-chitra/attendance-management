import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import DashboardLayout from '../../components/DashboardLayout'
import { Box, Card, Typography, Button, IconButton, Grid, Avatar } from '@mui/material'
import { ArrowBack, CheckCircle, Cancel, AccessTime } from '@mui/icons-material'
import { attendanceAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CheckInOutSimple = () => {
  const { user } = useAuth()
  const { colors } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(() => {
    fetchTodayStatus()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchTodayStatus = async () => {
    try {
      const res = await attendanceAPI.getTodayAttendance()
      const today = Array.isArray(res.data) ? res.data[0] : res.data
      
      if (today) {
        setCheckInTime(today.checkIn || null)
        setCheckOutTime(today.checkOut || null)
        setIsCheckedIn(!!today.checkIn && !today.checkOut)
        
        const newRecords = []
        if (today.checkIn) newRecords.push({ type: 'check-in', time: today.checkIn, date: today.date })
        if (today.checkOut) newRecords.push({ type: 'check-out', time: today.checkOut, date: today.date })
        setRecords(newRecords)
      }
    } catch (error) {
      console.error('Error fetching today attendance:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn()
      toast.success('Successfully checked in!')
      fetchTodayStatus()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed')
    }
  }

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut()
      toast.success('Successfully checked out!')
      fetchTodayStatus()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed')
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <DashboardLayout title="Daily Attendance">
      <Box sx={{
        background: colors.header.gradient,
        color: 'white',
        p: 3,
        borderRadius: '0 0 16px 16px',
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <IconButton onClick={() => navigate(-1)} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Check In / Out
        </Typography>
      </Box>

      <Box px={3} pb={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', py: 5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h2" sx={{ color: colors.primary.main, fontWeight: 700, mb: 1 }}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Typography>
              <Typography variant="h6" color="text.secondary" mb={3}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 3,
                py: 1,
                bgcolor: isCheckedIn ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                color: isCheckedIn ? '#4caf50' : '#9e9e9e',
                borderRadius: '20px',
                fontWeight: 600
              }}>
                {isCheckedIn ? <CheckCircle /> : <AccessTime />}
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </Box>
            </Card>

            <Box mt={3}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" mb={2}>Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" variant="body2">Check In</Typography>
                     <Typography variant="h6" color="success.main">{checkInTime ? (checkInTime.toLocaleTimeString ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : checkInTime) : '--:--'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" variant="body2">Check Out</Typography>
                    <Typography variant="h6" color="error.main">{checkOutTime ? (checkOutTime.toLocaleTimeString ? checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : checkOutTime) : '--:--'}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ textAlign: 'center', py: 4, borderRadius: 3, border: isCheckedIn ? '2px solid transparent' : '2px solid #4caf50', cursor: isCheckedIn ? 'not-allowed' : 'pointer' }}>
                  <Avatar sx={{ bgcolor: isCheckedIn ? '#ccc' : '#4caf50', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                    <CheckCircle sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" mb={1}>Check In</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>Start your work day</Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isCheckedIn}
                    onClick={handleCheckIn}
                    sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, maxWidth: '200px' }}
                  >
                    Check In Now
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ textAlign: 'center', py: 4, borderRadius: 3, border: !isCheckedIn ? '2px solid transparent' : '2px solid #f44336', cursor: !isCheckedIn ? 'not-allowed' : 'pointer' }}>
                  <Avatar sx={{ bgcolor: !isCheckedIn ? '#ccc' : '#f44336', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                    <Cancel sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" mb={1}>Check Out</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>End your work day</Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!isCheckedIn}
                    onClick={handleCheckOut}
                    sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' }, maxWidth: '200px' }}
                  >
                    Check Out Now
                  </Button>
                </Card>
              </Grid>
            </Grid>

            {/* Logs component hidden to save space, but kept structure */}
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" mb={2}>Today's Records</Typography>
              {records.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>No records yet.</Typography>
              ) : (
                records.map((rec, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: rec.type === 'check-in' ? '#4caf50' : '#f44336' }}>
                        {rec.type === 'check-in' ? <CheckCircle /> : <Cancel />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{rec.type === 'check-in' ? 'Check In' : 'Check Out'}</Typography>
                        <Typography variant="body2" color="text.secondary">{rec.time}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

export default CheckInOutSimple
