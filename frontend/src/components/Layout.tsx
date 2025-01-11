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

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true); // Estado para controlar o Drawer permanente

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const drawer = (
    <Box sx={{ width: 240 }}>
      <Toolbar />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <span className="material-icons">home</span>
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <span className="material-icons">dashboard</span>
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <span className="material-icons">menu</span>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Meu Layout
          </Typography>
          <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
            <span className="material-icons">{open ? 'chevron_left' : 'chevron_right'}</span>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: open ? 240 : 0, boxSizing: 'border-box' },
        }}
        open={open}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: open ? 30 : 0 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;