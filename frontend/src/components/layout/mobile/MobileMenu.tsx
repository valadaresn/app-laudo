import React from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/authContext';
//import { useAuth } from '../auth/authContext';

interface MobileMenuProps {
  onLogout: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onLogout, onClose }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const email = user?.email || '';
  const initial = email.charAt(0).toUpperCase();

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1400,
        display: 'flex',
        justifyContent: 'flex-start',
      }}
      onClick={handleOverlayClick}
    >
      <Box
        sx={{
          width: '80%', // Ocupa 80% da largura da tela
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px', // Aumentar a altura do header
            backgroundColor: '#FFFFFF', // Fundo branco
            color: theme.palette.primary.main,
          }}
        >
          <AssignmentIcon sx={{ marginRight: '10px', fontSize: '32px', color: theme.palette.primary.main }} />
          <Typography variant="h5" sx={{ flexGrow: 1, color: '#000000', fontWeight: 'bold' }}>Perícias</Typography>
          <IconButton onClick={onClose} sx={{ color: theme.palette.primary.main }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, padding: '10px' }}>
          {/* Body content goes here */}
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#F5F5F5',
          }}
        >
          <Box
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
            }}
          >
            <Typography variant="body1">{initial}</Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              color: 'gray',
              fontSize: '0.800rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(100% - 80px)', // Limite visual do email
            }}
          >
            {email}
          </Typography>
          <IconButton onClick={onLogout} sx={{ color: theme.palette.primary.main }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileMenu;