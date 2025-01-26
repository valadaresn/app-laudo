import React from 'react';
import { Button, Typography } from '@mui/material';
import { useAuth } from './authContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Handle successful logout (e.g., redirect or update state)
    } catch {
      // Handle logout error if necessary
    }
  };

  return (
    <div>
      <Typography variant="h6">Are you sure you want to logout?</Typography>
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
    </div>
  );
};

export default Logout;