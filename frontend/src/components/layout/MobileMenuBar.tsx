import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

interface MobileMenuBarProps {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

const MobileMenuBar: React.FC<MobileMenuBarProps> = ({ open, onClose, userEmail, onLogout }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        <ListItem>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="NomeDoApp" />
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Menu Item 1" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Menu Item 2" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={userEmail || 'user@example.com'} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MobileMenuBar;