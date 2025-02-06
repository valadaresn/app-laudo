import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Status, statusLabels } from '../../../models/Status';

interface MobileListBottomNavProps {
  value: Status;
  onChange: (event: React.SyntheticEvent, newValue: Status) => void;
}

const MobileListBottomNav: React.FC<MobileListBottomNavProps> = ({ value, onChange }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigationChange = (event: React.SyntheticEvent, newValue: Status) => {
    onChange(event, newValue);
    switch (newValue) {
      case 'register':
        navigate('/');
        break;
      case 'scheduling':
        navigate('/mobile-list/scheduling');
        break;
      case 'expertise':
        navigate('/mobile-list/expertise');
        break;
      case 'report':
        navigate('/mobile-list/report');
        break;
      default:
        break;
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleNavigationChange}
      showLabels
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        backgroundColor: theme.palette.primary.main 
      }}
    >
      <BottomNavigationAction
        label={statusLabels.register}
        icon={<HomeIcon />}
        value="register"
        showLabel
        sx={bottomNavActionStyles}
      />
      <BottomNavigationAction
        label={"Agend."}
        icon={<ScheduleIcon />}
        value="scheduling"
        showLabel
        sx={bottomNavActionStyles}
      />
      <BottomNavigationAction
        label={statusLabels.expertise}
        icon={<AssignmentIcon />}
        value="expertise"
        showLabel
        sx={bottomNavActionStyles}
      />
      <BottomNavigationAction
        label={statusLabels.report}
        icon={<DescriptionIcon />}
        value="report"
        showLabel
        sx={bottomNavActionStyles}
      />
    </BottomNavigation>
  );
};

const bottomNavActionStyles = {
  color: '#B0B0B0',
  '&.Mui-selected': {
    color: '#FFFFFF',
  },
  // Define o tamanho de fonte padrão
  '& .MuiBottomNavigationAction-label': {
    fontSize: '12px',
  },
  // Mantém o mesmo tamanho de fonte ao selecionar
  '&.Mui-selected .MuiBottomNavigationAction-label': {
    fontSize: '12px',
  },
};

export default MobileListBottomNav;