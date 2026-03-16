import React from 'react'
import {
  Grid,
  Button,
  Box
} from '@mui/material'
import {
  AccessTime,
  LocationOn,
  Assignment,
  TrendingUp,
  Event,
  People,
  CheckCircle,
  Security
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const QuickActions = ({ role }) => {
  const navigate = useNavigate()
  const { colors } = useTheme()

  const getEmployeeActions = () => [
    {
      label: 'My Profile',
      icon: <People />,
      path: '/employee/profile',
      color: 'primary'
    },
    {
      label: 'Attendance & Check-in',
      icon: <AccessTime />,
      path: '/employee/checkinout',
      color: 'primary'
    },
    {
      label: 'Leave Application',
      icon: <Event />,
      path: '/employee/leave-application',
      color: 'primary'
    },
    {
      label: 'My Tasks',
      icon: <Assignment />,
      path: '/employee/mytasks',
      color: 'primary'
    },
    {
      label: 'My Payroll',
      icon: <TrendingUp />,
      path: '/employee/payroll',
      color: 'primary'
    },
    {
      label: 'Performance Reviews',
      icon: <CheckCircle />,
      path: '/employee/performance',
      color: 'primary'
    }
  ]

  const getAdminActions = () => [
    {
      label: 'Manage Employees',
      icon: <People />,
      path: '/admin/manage-employees',
      color: 'error'
    },
    {
      label: 'Attendance Logs',
      icon: <AccessTime />,
      path: '/admin/attendance',
      color: 'error'
    },
    {
      label: 'Leave Requests',
      icon: <Event />,
      path: '/admin/leaves',
      color: 'error'
    },
    {
      label: 'Payroll',
      icon: <TrendingUp />,
      path: '/admin/payroll',
      color: 'error'
    },
    {
      label: 'Performance',
      icon: <CheckCircle />,
      path: '/admin/performance',
      color: 'error'
    },
    {
      label: 'Tasks & Projects',
      icon: <Assignment />,
      path: '/admin/tasks',
      color: 'error'
    },
    {
      label: 'System Reports',
      icon: <TrendingUp />,
      path: '/admin/reports',
      color: 'error'
    },
    {
      label: 'Settings',
      icon: <Security />,
      path: '/admin/system-settings',
      color: 'error'
    }
  ]

  const getActions = () => {
    switch (role?.toLowerCase()) {
      case 'employee':
        return getEmployeeActions()
      case 'admin':
        return getAdminActions()
      default:
        return []
    }
  }

  const actions = getActions()

  if (actions.length === 0) return null

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: colors.header?.main || colors.primary.main,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        color: 'white',
        border: `1px solid rgba(255,255,255,0.1)`
      }}
    >
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={actions.length > 4 ? 2 : 3} key={index}>
            <Button
              variant="contained"
              color={action.color}
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: colors.primary.main,
                '&:hover': {
                  backgroundColor: 'white',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s'
              }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default QuickActions
