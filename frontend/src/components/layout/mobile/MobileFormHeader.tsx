import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

interface MobileFormHeaderProps {
  title: string;
  onClose: () => void;
}

function MobileFormHeader({ title, onClose }: MobileFormHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300, // z-index para ficar acima do resto
        backgroundColor: theme.palette.primary.main,
        color: '#FFFFFF',
        display: { xs: 'flex', md: 'none' }, // Mostrar apenas em dispositivos móveis
        alignItems: 'center',
        padding: '10px 0',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <IconButton onClick={onClose} sx={{ color: '#FFFFFF', marginLeft: '16px' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6" sx={{ marginLeft: '16px', flexGrow: 1 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default MobileFormHeader;