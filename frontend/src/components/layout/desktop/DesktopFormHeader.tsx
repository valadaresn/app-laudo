import React from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

interface DesktopFormHeaderProps {
  title: string;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
  isDirty: boolean;
}

const DesktopFormHeader: React.FC<DesktopFormHeaderProps> = ({
  title,
  onClose,
  onCancel,
  onSave,
  isDirty,
}) => {
  const theme = useTheme();

  return (
    <Box
      // Adiciona a classe para que o MUI aplique os ajustes de padding nos elementos fixos
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '10px 20px',
        backgroundColor: theme.palette.primary.main,
        color: '#FFFFFF',
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1300,
      }}
    >
      <IconButton onClick={onClose} sx={{ color: '#FFFFFF', marginRight: '16px', ml: '-8px' }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {isDirty && (
        <>
          <Button onClick={onCancel} sx={{ color: '#FFFFFF', marginRight: '16px' }}>
            Cancelar
          </Button>
          <Button onClick={onSave} sx={{ color: '#FFFFFF' }}>
            Salvar
          </Button>
        </>
      )}
    </Box>
  );
};

export default DesktopFormHeader;