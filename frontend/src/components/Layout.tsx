import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import themes from '../styles/theme'; // Import the themes

interface LayoutProps {
  children: React.ReactNode;
}

// Define the width of the Drawer when open and closed
const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_CLOSED = 60;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function Layout({ children }: LayoutProps) {
  const themePurple = themes.purple; // Choose the purple theme
  const isMobile = useMediaQuery(themePurple.breakpoints.down('sm')); // Detect if it's mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true); // Control the permanent Drawer on large screens

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const drawer = (
    <Box
      sx={{
        width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
        bgcolor: open ? themePurple.palette.primary.main : '#fafafa',
      }}
    >
      <DrawerHeader />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <HomeIcon sx={{ color: open ? 'white' : 'black' }} />
          </ListItemIcon>
          {open && <ListItemText primary="Home" sx={{ color: 'white' }} />}
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon sx={{ color: open ? 'white' : 'black' }} />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" sx={{ color: 'white' }} />}
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={themePurple}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Meu Layout
            </Typography>
            <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Temporary Drawer (mobile) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH_OPEN,
              boxSizing: 'border-box',
              bgcolor: themePurple.palette.primary.main,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Permanent Drawer (desktop) */}
        {!isMobile && ( // Hide the Drawer on mobile
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                // Dynamic width based on "open" state
                width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                boxSizing: 'border-box',
                bgcolor: open ? themePurple.palette.primary.main : '#fafafa',
              },
            }}
            open={open}
          >
            {drawer}
          </Drawer>
        )}

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            // Adjust transition and margin-left to not be behind the Drawer
            transition: themePurple.transitions.create(['margin', 'width'], {
              easing: themePurple.transitions.easing.sharp,
              duration: themePurple.transitions.duration.leavingScreen,
            }),
            // When the Drawer is open, push 240px.
            // When closed, push 60px.
            marginLeft: open ? `${DRAWER_WIDTH_OPEN}px` : `${DRAWER_WIDTH_CLOSED}px`,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout;