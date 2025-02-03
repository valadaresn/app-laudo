import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@mui/material/BottomNavigation';
import BottomNavAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Header from './Header';
import MobileMenuBar from './MobileMenuBar';

const statusLabels = {
  register: 'Register',
  scheduling: 'Scheduling',
  expertise: 'Expertise',
};

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [value, setValue] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigationChange = (_: unknown, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/mobile-list/scheduling');
        break;
      case 2:
        navigate('/mobile-list/expertise');
        break;
      default:
        break;
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header title="App Title" onMenu={handleMenuToggle} />
      <MobileMenuBar open={menuOpen} onClose={handleMenuToggle} userEmail="user@example.com" onLogout={() => console.log('Logout clicked')} />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </Box>
      <BottomNav value={value} onChange={handleNavigationChange} showLabels>
        <BottomNavAction label={statusLabels.register} icon={<HomeIcon />} showLabel />
        <BottomNavAction label={statusLabels.scheduling} icon={<ScheduleIcon />} showLabel />
        <BottomNavAction label={statusLabels.expertise} icon={<AssignmentIcon />} showLabel />
      </BottomNav>
    </Box>
  );
}

export default MobileLayout;