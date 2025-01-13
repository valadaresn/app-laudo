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
import { styled, useTheme } from '@mui/material/styles';

interface LayoutProps {
  children: React.ReactNode;
}

// Defina a largura do Drawer quando aberto e quando fechado
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
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true); // controla o Drawer permanente em telas grandes

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
        bgcolor: open ? theme.palette.primary.main : '#fafafa',
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

      {/* Drawer temporário (mobile) */}
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
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer permanente (desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            // Largura dinâmica conforme estado "open"
            width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
            boxSizing: 'border-box',
            bgcolor: open ? theme.palette.primary.main : '#fafafa',
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          // Ajuste a transição e a margin-left para não ficar atrás do Drawer
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Quando o Drawer estiver aberto, empurramos 240px.
          // Quando fechado, empurramos 60px.
          marginLeft: {
            xs: 0, // em telas pequenas não empurramos nada, pois usamos o Drawer temporário
            sm: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
