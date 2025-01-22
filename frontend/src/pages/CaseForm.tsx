import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ICase, defaultValues } from '../models/ICase';
import { Status } from '../models/Status';
import CaseService from '../services/CaseService';
import { Container, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import FormHeader from '../components/caseForm/FormHeader';
import Tabs from '../components/caseForm/Tabs';
import RegisterFields from '../components/caseForm/RegisterFields';
import SchedulingFields from '../components/caseForm/SchedulingFields';
import ExpertiseFields from '../components/caseForm/ExpertiseFields';
import ReportFields from '../components/caseForm/ReportFields';
import PaymentFields from '../components/caseForm/PaymentFields';

interface CaseFormProps {
  cardId: string | null;
  onClose: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ cardId, onClose }) => {
  const methods = useForm<ICase>({ defaultValues });
  const { handleSubmit, reset, formState: { isDirty }, getValues } = methods;

  const [activeTab, setActiveTab] = useState<Status>('register');
  const initialValuesRef = useRef<ICase | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  useEffect(() => {
    if (cardId) {
      const unsubscribe = CaseService.getCaseById(cardId, (cardData) => {
        if (cardData) {
          reset(cardData);
          initialValuesRef.current = cardData;
          setActiveTab(cardData.status);
        } else {
          reset(defaultValues);
          initialValuesRef.current = defaultValues;
          setActiveTab('register');
        }
      });
      return () => unsubscribe();
    } else {
      reset(defaultValues);
      initialValuesRef.current = defaultValues;
      setActiveTab('register');
    }
  }, [cardId, reset]);

  const handleSave = async () => {
    const currentValues = getValues();

    if (cardId) {
      await CaseService.updateCase(cardId, currentValues);
    } else {
      await CaseService.addCase(currentValues);
    }
    reset(currentValues);
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      setOnConfirm(() => handleSave);
      setOpenConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setOpenConfirmDialog(false);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Container style={{ height: '100vh', padding: 0, paddingBottom: '60px' }}>
        <FormHeader isDirty={isDirty} handleSave={handleSave} cardId={cardId || null} />
        <Tabs
          cardStatus={initialValuesRef.current?.status}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <form onSubmit={handleSubmit(handleSave)}>
          {activeTab === 'register' && (<RegisterFields />)}
          {activeTab === 'scheduling' && (<SchedulingFields />)}
          {activeTab === 'expertise' && (<ExpertiseFields />)}
          {activeTab === 'report' && (<ReportFields />)}
          {activeTab === 'payment' && (<PaymentFields />)}

          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            style={{ marginLeft: '8px' }}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </form>
      </Container>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem alterações não salvas. Deseja salvar antes de sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            Não
          </Button>
          <Button
            onClick={async () => {
              await onConfirm();
              setOpenConfirmDialog(false);
            }}
            color="primary"
          >
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default CaseForm;
