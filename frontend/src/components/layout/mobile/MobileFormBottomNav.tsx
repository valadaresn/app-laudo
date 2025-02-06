import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface MobileFormBottomNavProps {
  onCancel: () => void;
  onSave: () => void;
}

function MobileFormBottomNav({ onCancel, onSave }: MobileFormBottomNavProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300, // z-index para ficar acima do resto
        backgroundColor: '#FFFFFF',
        display: { xs: 'flex', md: 'none' }, // Mostrar apenas em dispositivos móveis
        justifyContent: 'space-between',
        padding: '10px 0',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Button
        onClick={onCancel}
        sx={{
          width: '50%',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          border: 'none',
          textTransform: 'none',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        Cancelar
      </Button>
      <Button
        onClick={onSave}
        sx={{
          width: '50%',
          backgroundColor: '#FFFFFF',
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          border: 'none',
          textTransform: 'none',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        Salvar
      </Button>
    </Box>
  );
}

export default MobileFormBottomNav;