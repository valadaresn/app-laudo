import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ICase, IExpertise, defaultValues } from '../models/ICase';
import { Status } from '../models/Status';
import CaseService from '../services/CaseService';
import { Container,  Button,  Dialog,  DialogActions,  DialogContent,  DialogContentText,  DialogTitle,  List,  ListItem,  ListItemButton,  ListItemText,  useMediaQuery,  useTheme} from '@mui/material';
import FormHeader from '../components/caseForm/FormHeader';
import Tabs from '../components/caseForm/Tabs';
import RegisterFields from '../components/caseForm/RegisterFields';
import SchedulingFields from '../components/caseForm/SchedulingFields';
import ExpertiseFields from '../components/caseForm/ExpertiseFields';
import ReportFields from '../components/caseForm/ReportFields';
import PaymentFields from '../components/caseForm/PaymentFields';
import ExpertiseForm from './ExpertiseForm';
import Modal from '../components/Modal';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface CaseFormProps {
  caseId: string | null;
  onClose: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ caseId: caseId, onClose }) => {
  const methods = useForm<ICase>({ defaultValues });
  const {
    handleSubmit,
    reset,
    formState: { isDirty }
  } = methods;

  const [activeTab, setActiveTab] = useState<Status>('register');
  const initialValuesRef = useRef<ICase | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | undefined>(undefined);
  const [expertises, setExpertises] = useState<IExpertise[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Carrega o caso do banco e inicializa o formulário
   */
  useEffect(() => {
    if (caseId) {
      const unsubscribe = CaseService.getCaseById(caseId, (cardData) => {
        if (cardData) {
          reset({
            ...cardData,
            id: caseId // Define o id explicitamente no formulário
          });
          initialValuesRef.current = { ...cardData, id: caseId };
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
  }, [caseId, reset]);

  /**
   * Busca as perícias relacionadas ao caso usando diretamente o cardId
   */
  useEffect(() => {
    if (caseId) {
      console.log('Fetching expertises for caseId:', caseId);
      const q = query(collection(db, 'expertises'), where('caseId', '==', caseId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expertiseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as IExpertise[];
        console.log('Fetched expertises:', expertiseList);
        setExpertises(expertiseList);
      });

      return () => unsubscribe();
    } else {
      console.log('No caseId found');
    }
  }, [caseId]);

  /**
   * Salva o formulário (atualização ou criação)
   */
  const handleSave = async () => {
    const currentValues = methods.getValues();

    if (caseId) {
      // Atualiza o caso existente
      await CaseService.updateCase(caseId, currentValues);
    } else {
      // Cria um novo caso
      await CaseService.addCase(currentValues);
    }
    reset(currentValues);
    onClose();
  };

  /**
   * Verifica se há alterações não salvas ao fechar
   */
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

  /**
   * Controla abertura/fechamento do Modal de Expertise
   */
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
        <Container style={{ height: '100vh', padding: 0, paddingBottom: '60px' }}>
          <FormHeader
            isDirty={isDirty}
            handleSave={handleSave}
            cardId={caseId || null}
          />

          <Tabs
            cardStatus={initialValuesRef.current?.status}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <form onSubmit={handleSubmit(handleSave)}>
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

                <List>
                  {expertises.map((expertise) => (
                    <ListItem key={expertise.id} disablePadding>
                      <ListItemButton onClick={() => handleOpenModal(expertise.id)}>
                        <ListItemText primary={`Perícia em ${expertise.plaintiff}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {activeTab === 'report' && <ReportFields />}
            {activeTab === 'payment' && <PaymentFields />}

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
