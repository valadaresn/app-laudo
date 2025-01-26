import { useState } from 'react';
import { Container, Button, useMediaQuery, useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import ExpertiseForm from './ExpertiseForm';
import Modal from '../components/Modal';
import { useCaseForm } from '../hooks/useCaseForm';
import FormHeader from '../components/caseForm/FormHeader';
import Tabs from '../components/caseForm/Tabs';
import RegisterFields from '../components/caseForm/RegisterFields';
import SchedulingFields from '../components/caseForm/SchedulingFields';
import ExpertiseFields from '../components/caseForm/ExpertiseFields';
import ReportFields from '../components/caseForm/ReportFields';
import PaymentFields from '../components/caseForm/PaymentFields';
import { defaultValues } from '../models/ICase';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ExpertiseList from '../components/caseForm/ExpertiseList';

interface CaseFormProps {
  caseId: string | null;
  onClose: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ caseId, onClose }) => {
  const { methods, handleSave, isDirty, activeTab, setActiveTab } = useCaseForm(caseId, defaultValues);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | undefined>(undefined);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => { });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    if (isDirty) {
      setOnConfirm(() => handleSave);
      setOpenConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleOpenModal = (expertiseId: string | undefined = undefined) => {
    setSelectedExpertiseId(expertiseId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveAndClose = async () => {
    if (navigator.onLine) {
      await handleSave();
    } else {
      handleSave();
    }
    onClose();
  };

  return (
    <FormProvider {...methods}>
      {!isModalOpen && (
        <Container style={{ height: '100vh', padding: 0, paddingBottom: '60px' }}>
          <FormHeader isDirty={isDirty} handleSave={handleSaveAndClose} cardId={caseId || null} />
          <Tabs cardStatus={methods.getValues().status} activeTab={activeTab} setActiveTab={setActiveTab} />
          <form onSubmit={methods.handleSubmit(handleSaveAndClose)}>
            {activeTab === 'register' && <RegisterFields />}
            {activeTab === 'scheduling' && <SchedulingFields />}
            {activeTab === 'expertise' && (
              <>
                <ExpertiseFields />
                <Button variant="contained" color="primary" onClick={() => handleOpenModal(undefined)} style={{ marginTop: '16px' }}>
                  Realizar Perícia
                </Button>
                <ExpertiseList caseId={caseId!} onExpertiseSelect={handleOpenModal} />
              </>
            )}
            {activeTab === 'report' && <ReportFields />}
            {activeTab === 'payment' && <PaymentFields />}
            <Button type="button" variant="outlined" color="secondary" onClick={handleClose} style={{ marginLeft: '8px' }}>
              Cancelar
            </Button>
            <Button type="button" variant="outlined" color="inherit" onClick={onClose} style={{ marginLeft: '8px' }}>
              Fechar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </form>
        </Container>
      )}
      {isModalOpen && (
        isMobile ? (
          <ExpertiseForm expertiseId={selectedExpertiseId} onClose={handleCloseModal} />
        ) : (
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <ExpertiseForm expertiseId={selectedExpertiseId} onClose={handleCloseModal} />
          </Modal>
        )
      )}

      <ConfirmDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} onConfirm={onConfirm} />
    </FormProvider>
  );
};

export default CaseForm;