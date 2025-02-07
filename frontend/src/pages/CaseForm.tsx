import { useState } from 'react';
import { Button, useMediaQuery, useTheme, Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import ExpertiseForm from './ExpertiseForm';
import Modal from '../components/Modal';
import { useCaseForm } from '../hooks/useCaseForm';
import MobileFormHeader from '../components/layout/mobile/MobileFormHeader';
import DesktopFormHeader from '../components/layout/desktop/DesktopFormHeader';
import Tabs from '../components/caseForm/Tabs';
import RegisterFields from '../components/caseForm/RegisterFields';
import SchedulingFields from '../components/caseForm/SchedulingFields';
import ExpertiseFields from '../components/caseForm/ExpertiseFields';
import ReportFields from '../components/caseForm/ReportFields';
import PaymentFields from '../components/caseForm/PaymentFields';
import { defaultValues } from '../models/ICase';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ExpertiseList from '../components/caseForm/ExpertiseList';
import MobileFormBottomNav from '../components/layout/mobile/MobileFormBottomNav';

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
        <>
          {isMobile ? (
            <>
              <MobileFormHeader title="Processo" onClose={handleClose} />
              <Box style={{ height: '100vh', padding: 0, paddingTop: '00px', paddingBottom: '120px', marginBottom: '00px' }}>
                <Tabs cardStatus={methods.getValues().status} activeTab={activeTab} setActiveTab={setActiveTab} />
                <form onSubmit={methods.handleSubmit(handleSaveAndClose)}>
                  {activeTab === 'register' && <RegisterFields />}
                  {activeTab === 'scheduling' && <SchedulingFields />}
                  {activeTab === 'expertise' && (
                    <>
                      <ExpertiseFields />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(undefined)}
                        style={{ marginTop: '16px' }}
                      >
                        Realizar Perícia
                      </Button>
                      <ExpertiseList caseId={caseId!} onExpertiseSelect={handleOpenModal} />
                    </>
                  )}
                  {activeTab === 'report' && <ReportFields />}
                  {activeTab === 'payment' && <PaymentFields />}
                </form>
              </Box>
              <MobileFormBottomNav onCancel={handleClose} onSave={handleSaveAndClose} />
            </>
          ) : (
            <>
              {/* O DesktopFormHeader está fixo; o conteúdo rolável é gerenciado abaixo */}
              <DesktopFormHeader  title="Processo" onClose={handleClose} onCancel={handleClose} onSave={handleSaveAndClose}  isDirty={isDirty} />
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
                <Tabs cardStatus={methods.getValues().status} activeTab={activeTab} setActiveTab={setActiveTab} />
                <form onSubmit={methods.handleSubmit(handleSaveAndClose)}>
                  {activeTab === 'register' && <RegisterFields />}
                  {activeTab === 'scheduling' && <SchedulingFields />}
                  {activeTab === 'expertise' && (
                    <>
                      <ExpertiseFields />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(undefined)}
                        style={{ marginTop: '16px' }}
                      >
                        Realizar Perícia
                      </Button>
                      <ExpertiseList caseId={caseId!} onExpertiseSelect={handleOpenModal} />
                    </>
                  )}
                  {activeTab === 'report' && <ReportFields />}
                  {activeTab === 'payment' && <PaymentFields />}
                </form>
              </Box>
            </>
          )}
        </>
      )}
      {isModalOpen &&
        (isMobile ? (
          <ExpertiseForm expertiseId={selectedExpertiseId} onClose={handleCloseModal} />
        ) : (
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <ExpertiseForm expertiseId={selectedExpertiseId} onClose={handleCloseModal} />
          </Modal>
        ))}
      <ConfirmDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} onConfirm={onConfirm} />
    </FormProvider>
  );
};

export default CaseForm;