import React from 'react';
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
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

const DRAWER_WIDTH = 60;

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Barra Superior (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Meu Layout
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Barra lateral (Drawer) permanente, somente ícones */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
          },
        }}
      >
        {/* Trocamos o <Toolbar /> por um pequeno espaço para não "colar" os ícones no topo */}
        <Box sx={{ mt: 2 }} />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon sx={{ color: 'white' }} />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon sx={{ color: 'white' }} />
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${DRAWER_WIDTH}px`, // Empurra para a direita o conteúdo
          mt: '-300px', // Altera aqui para menos, se quiser o conteúdo mais pra cima
          p: 2,
        }}
      >
        {children || (
          <Typography variant="body1">
            Aqui fica o conteúdo principal (ex.: tela do Kambam).
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Layout;
