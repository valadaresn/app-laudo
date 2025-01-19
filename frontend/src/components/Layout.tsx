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
import { styled, ThemeProvider } from '@mui/material/styles';
import themes from '../styles/theme'; // Importa os temas

interface LayoutProps {
  children: React.ReactNode;
}

// Define a largura do Drawer quando aberto e fechado
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
  const themePurple = themes.purple; // Escolhe o tema roxo
  const [open, setOpen] = useState(true); // Controla o Drawer permanente em telas grandes

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  // Definição do conteúdo do Drawer (menu lateral)
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

  // Definição da AppBar (barra superior) e do layout principal
  return (
    <ThemeProvider theme={themePurple}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerOpen}>
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

        {/* Permanent Drawer (desktop) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              // Largura dinâmica baseada no estado "open"
              width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
              boxSizing: 'border-box',
              bgcolor: open ? themePurple.palette.primary.main : '#fafafa',
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
            // Ajusta a transição e a margem esquerda para não ficar atrás do Drawer
            transition: themePurple.transitions.create(['margin', 'width'], {
              easing: themePurple.transitions.easing.sharp,
              duration: themePurple.transitions.duration.leavingScreen,
            }),
            // Quando o Drawer está aberto, empurra 240px.
            // Quando fechado, empurra 60px.
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