import React, { useState } from 'react';
import {  AppBar,  Toolbar,  Typography,  IconButton,  Drawer,  Box,  List,  ListItemButton,  ListItemIcon,  ListItemText,  CssBaseline,  Button,} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import themes from '../../../styles/theme';
import { useAuth } from '../../auth/authContext';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_CLOSED = 60;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function DesktopLayout({ children }: DesktopLayoutProps) {
  const themePurple = themes.purple;
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon sx={{ color: open ? 'white' : 'black' }} />
          </ListItemIcon>
          {open && <ListItemText primary="Home" sx={{ color: 'white' }} />}
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard">
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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Meu Layout
            </Typography>
            {user ? (
              <>
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {user.email}
                </Typography>
                <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
                Login
              </Button>
            )}
            <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
              boxSizing: 'border-box',
              bgcolor: open ? themePurple.palette.primary.main : '#fafafa',
            },
          }}
          open={open}
        >
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            transition: themePurple.transitions.create(['margin', 'width'], {
              easing: themePurple.transitions.easing.sharp,
              duration: themePurple.transitions.duration.leavingScreen,
            }),
            marginLeft: open ? `${DRAWER_WIDTH_OPEN}px` : `${DRAWER_WIDTH_CLOSED}px`,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DesktopLayout;