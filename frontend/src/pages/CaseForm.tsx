import { useState } from 'react';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { useCaseForm } from '../hooks/useCaseForm';
import { defaultValues } from '../models/ICase';
import ExpertiseForm from './ExpertiseForm';
import ExpertiseList from '../components/caseForm/ExpertiseList';
import GenericForm from '../components/common/GenericForm';
import Tabs from '../components/caseForm/Tabs';
import RegisterFields from '../components/caseForm/RegisterFields';
import SchedulingFields from '../components/caseForm/SchedulingFields';
import ExpertiseFields from '../components/caseForm/ExpertiseFields';
import ReportFields from '../components/caseForm/ReportFields';
import PaymentFields from '../components/caseForm/PaymentFields';
import Modal from '../components/Modal';
import { FormProvider } from 'react-hook-form';

interface CaseFormProps {
  caseId: string | null;
  onClose: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ caseId, onClose }) => {
  const { methods, handleSave, isDirty, activeTab, setActiveTab } = useCaseForm(caseId, defaultValues);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | undefined>(undefined);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenModal = (expertiseId: string | undefined = undefined) => {
    setSelectedExpertiseId(expertiseId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <FormProvider {...methods}>
      {!isModalOpen && (
        <GenericForm
          formMethods={methods}
          title="Processo"
          onSave={handleSave}
          onClose={onClose}
          isDirty={isDirty}
        >
          <Tabs cardStatus={methods.getValues().status} activeTab={activeTab} setActiveTab={setActiveTab} />
          <form onSubmit={methods.handleSubmit(handleSave)}>
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
        </GenericForm>
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
    </FormProvider>
  );
};

export default CaseForm;