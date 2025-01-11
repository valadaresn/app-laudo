import React, { forwardRef, ReactNode } from 'react';
import { Box, Toolbar, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Home, Dashboard, Assignment } from '@mui/icons-material';

const drawerWidth = 240;

// Adaptador Link que o MUI vai entender como “component”
const MUILink = forwardRef<HTMLAnchorElement, RouterLinkProps>(function MUILink(props, ref) {
  return <RouterLink ref={ref} {...props} />;
});

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItemButton component={MUILink} to="/">
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>

              <ListItemButton component={MUILink} to="/kanban">
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Kanban Board" />
              </ListItemButton>

              <ListItemButton component={MUILink} to="/cases">
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText primary="Cases" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;