import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ICase, defaultValues } from '../models/ICase';
import CaseService from '../services/CaseService';
import { Container, Button } from '@mui/material';
import RegisterFields from '../components/caseForm/RegisterFields';

interface CaseFormProps {
  caseId: string | null;
  onClose: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ caseId, onClose }) => {
  const methods = useForm<ICase>({ defaultValues });
  const { handleSubmit, reset, formState: { isDirty } } = methods;
  const initialValuesRef = useRef<ICase | null>(null);

  useEffect(() => {
    if (caseId) {
      const unsubscribe = CaseService.getCaseById(caseId, (caseData) => {
        if (caseData) {
          console.log('Case data loaded:', caseData); // Log dos dados do caso
          reset(caseData); // Inicializa o formulário com os dados do caso
          initialValuesRef.current = caseData;
        } else {
          console.log('Case not found, resetting to default values'); // Log se o caso não for encontrado
          reset(defaultValues); // Limpa o formulário se o caso não for encontrado
          initialValuesRef.current = defaultValues;
        }
      });
      return () => unsubscribe();
    } else {
      console.log('No caseId provided, resetting to default values'); // Log se não houver caseId
      reset(defaultValues); // Limpa o formulário para um novo caso
      initialValuesRef.current = defaultValues;
    }
  }, [caseId, reset]);

  const handleSave = async () => {
    const currentValues = methods.getValues();
    if (caseId) {
      await CaseService.updateCase(caseId, currentValues);
    } else {
      await CaseService.addCase(currentValues);
    }
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('Você tem alterações não salvas. Deseja salvar antes de sair?')) {
        handleSave();
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <FormProvider {...methods}>
      <Container style={{ height: '100vh', padding: 0, paddingBottom: '60px' }}>
        <form onSubmit={handleSubmit(handleSave)}>
          <RegisterFields />
          <Button type="button" variant="outlined" color="secondary" onClick={handleClose} style={{ marginLeft: '8px' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </form>
      </Container>
    </FormProvider>
  );
};

export default CaseForm;