import React, { useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Container,
  IconButton
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { Menu as MenuIcon } from '@mui/icons-material'
import UserProfile from './UserProfile'
import Sidebar from './Sidebar'
import { useTheme } from '../contexts/ThemeContext'

const drawerWidth = 280

const DashboardLayout = ({ children, title }) => {
  const location = useLocation()
  const { colors } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x)
    
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          
          return isLast ? (
            <Typography key={name} color="text.primary" sx={{ fontWeight: 500 }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
          ) : (
            <MuiLink
              component={Link}
              to={routeTo}
              underline="hover"
              color="inherit"
              key={name}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </MuiLink>
          )
        })}
      </Breadcrumbs>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sidebar open={mobileOpen} toggleDrawer={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        {/* Top Navigation Bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            backgroundColor: colors.background.paper,
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            color: '#1e293b'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <Box>
                {title && (
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0 }}>
                    {title}
                  </Typography>
                )}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {generateBreadcrumbs()}
                </Box>
              </Box>
            </Box>

            {/* Right side - User Profile */}
            <UserProfile />
          </Toolbar>
        </AppBar>

        {/* Dynamic Content */}
        <Box sx={{ flex: 1, backgroundColor: colors.background.default, py: 3 }}>
          <Container maxWidth="xl">
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
