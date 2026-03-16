import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material'
import {
  Dashboard,
  People,
  AccessTime,
  EventNote,
  Payments,
  TrendingUp,
  Assignment,
  Assessment,
  Settings,
  Logout,
  Close,
  ChevronLeft
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const drawerWidth = 280

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { colors } = useTheme()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))

  const role = user?.role || 'employee'

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: `/dashboard/${role}`, roles: ['admin', 'employee', 'hr'] },
    { text: 'Employees', icon: <People />, path: '/admin/manage-employees', roles: ['admin', 'hr'] },
    { text: 'Attendance', icon: <AccessTime />, path: role === 'admin' ? '/admin/attendance' : '/employee/attendance', roles: ['admin', 'employee', 'hr'] },
    { text: 'Leave Requests', icon: <EventNote />, path: role === 'admin' ? '/admin/leaves' : '/employee/leave-application', roles: ['admin', 'employee', 'hr'] },
    { text: 'Payroll', icon: <Payments />, path: role === 'admin' ? '/admin/payroll' : '/employee/payroll', roles: ['admin', 'employee', 'hr'] },
    { text: 'Performance', icon: <TrendingUp />, path: role === 'admin' ? '/admin/performance' : '/employee/performance', roles: ['admin', 'hr'] },
    { text: 'Tasks & Projects', icon: <Assignment />, path: role === 'admin' ? '/admin/tasks' : '/employee/mytasks', roles: ['admin', 'employee', 'hr'] },
    { text: 'System Reports', icon: <Assessment />, path: '/admin/reports', roles: ['admin', 'hr'] },
    { text: 'Settings', icon: <Settings />, path: '/admin/system-settings', roles: ['admin'] },
  ]

  const filteredItems = menuItems.filter(item => item.roles.includes(role))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary.main, letterSpacing: 1 }}>
          EMS PORTAL
        </Typography>
        {isMobile && open && (
          <Box onClick={toggleDrawer} sx={{ cursor: 'pointer', display: 'flex' }}>
            <ChevronLeft />
          </Box>
        )}
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) toggleDrawer()
                }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  color: isActive ? colors.primary.main : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? colors.primary.main : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem', 
                    fontWeight: isActive ? 600 : 500 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default Sidebar
