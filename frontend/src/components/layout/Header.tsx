import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface HeaderProps {
  title: string;
  onClose?: () => void;
  onMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onClose, onMenu }) => {
  const theme = useTheme();

  return (
    <AppBar position="static" style={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar>
        {onClose ? (
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <IconButton edge="start" color="inherit" onClick={onMenu}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;