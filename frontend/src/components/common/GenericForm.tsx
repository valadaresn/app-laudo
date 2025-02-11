import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form';
import MobileFormHeader from '../layout/mobile/MobileFormHeader';
import DesktopFormHeader from '../layout/desktop/DesktopFormHeader';
import MobileFormBottomNav from '../layout/mobile/MobileFormBottomNav';
import ConfirmDialog from './ConfirmDialog';

interface GenericFormProps<T extends FieldValues> {
  formMethods: UseFormReturn<T>;
  title: string;
  onSave: () => Promise<void>;
  onClose: () => void;
  isDirty: boolean;
  children: React.ReactNode;
}

function GenericForm<T extends FieldValues>({
  formMethods,
  title,
  onSave,
  onClose,
  isDirty,
  children,
}: GenericFormProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleClose = () => {
    if (isDirty) {
      setOpenConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = async () => {
    await onSave();
    setOpenConfirmDialog(false);
    onClose();
  };

  const handleSaveAndClose = async () => {
    if (navigator.onLine) {
      await onSave();
    } else {
      onSave();
    }
    onClose();
  };

  return (
    <FormProvider {...formMethods}>
      {isMobile ? (
        <>
          <MobileFormHeader title={title} onClose={handleClose} />
          <Box style={{ height: '100vh', padding: 0, paddingTop: '00px', paddingBottom: '120px', marginBottom: '00px' }}>
            {children}
          </Box>
          {isDirty && <MobileFormBottomNav onCancel={handleClose} onSave={handleSaveAndClose} />}
        </>
      ) : (
        <>
          <DesktopFormHeader
            title={title}
            onClose={handleClose}
            onCancel={handleClose}
            onSave={handleSaveAndClose}
            isDirty={isDirty}
          />
          <Box
            sx={{
              mt: '60px', // margem para compensar a altura do header fixo
              overflowY: 'auto',
              height: 'calc(100vh - 60px)', // 80px é a altura do header
              padding: '0 16px',
              maxHeight: '60vh',
              pb: '60px',
            }}
          >
            {children}
          </Box>
        </>
      )}
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirmClose}
        aria-labelledby="confirm-close-dialog"
        aria-describedby="confirm-close-description"
      />
    </FormProvider>
  );
}

export default GenericForm;