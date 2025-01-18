import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled, ThemeProvider } from '@mui/material/styles';
import { statusLabels } from '../models/Status';
import theme from '../styles/theme';

const BottomNav = styled(BottomNavigation)(({ theme }) => ({
  width: '100%',
  position: 'fixed',
  bottom: 0,
  backgroundColor: theme.palette.primary.main,
}));

const BottomNavAction = styled(BottomNavigationAction)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.common.white,
  },
}));

interface MobileLayoutProps {
  children: React.ReactNode;
}

function MobileLayout({ children }: MobileLayoutProps) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleNavigationChange = (_: unknown, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/mobile-list/register');
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ pb: 7 }}>
        {children}
        <BottomNav value={value} onChange={handleNavigationChange} showLabels>
          <BottomNavAction label={statusLabels.register} icon={<HomeIcon />} showLabel />
          <BottomNavAction label={statusLabels.scheduling} icon={<ScheduleIcon />} showLabel />
          <BottomNavAction label={statusLabels.expertise} icon={<AssignmentIcon />} showLabel />
        </BottomNav>
      </Box>
    </ThemeProvider>
  );
}

export default MobileLayout;