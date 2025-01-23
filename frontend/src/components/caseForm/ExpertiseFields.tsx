import { useState, useEffect } from 'react';
import { TextField, Box, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase, IExpertise } from '../../models/ICase';
import ExpertiseForm from '../../pages/ExpertiseForm';
import Modal from '../Modal';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function ExpertiseFields() {
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext<ICase>();
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | undefined>(undefined);
  const [expertises, setExpertises] = useState<IExpertise[]>([]);

  const handleOpenModal = (expertiseId: string | undefined = undefined) => {
    console.log('Opening modal for expertiseId:', expertiseId);
    setSelectedExpertiseId(expertiseId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setModalOpen(false);
  };

  useEffect(() => {
    const caseId = getValues('id');
    console.log('Setting up real-time listener for expertises for caseId:', caseId);
    const q = query(collection(db, 'expertises'), where('caseId', '==', caseId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expertiseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as IExpertise[];
      console.log('Fetched expertises in real-time:', expertiseList);
      setExpertises(expertiseList);
    });

    return () => unsubscribe();
  }, [getValues]);

  return (
    <Box className="form-group">
      <TextField
        label="Data Perícia"
        type="date"
        {...register('scheduling.finalExpertiseDate')}
        InputLabelProps={{
          shrink: true
        }}
        error={!!errors.scheduling?.finalExpertiseDate}
        helperText={errors.scheduling?.finalExpertiseDate?.message}
      />

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

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <ExpertiseForm expertiseId={selectedExpertiseId} onClose={handleCloseModal} />
      </Modal>
    </Box>
  );
}

export default ExpertiseFields;