import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { IExpertise } from '../../models/ICase';
import { db } from '../../firebaseConfig';

// Interface estendida para incluir o ID que vem do Firestore
interface ExpertiseWithId extends IExpertise {
  id: string;
}

interface ExpertiseListProps {
  caseId: string;
  onExpertiseSelect: (expertiseId: string) => void;
}

const ExpertiseList: React.FC<ExpertiseListProps> = ({ caseId, onExpertiseSelect }) => {
  const [expertises, setExpertises] = useState<ExpertiseWithId[]>([]);

  useEffect(() => {
    if (caseId) {
      const q = query(collection(db, 'expertises'), where('caseId', '==', caseId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expertiseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as ExpertiseWithId[];
        setExpertises(expertiseList);
      });
      return () => unsubscribe();
    }
  }, [caseId]);

  return (
    <List>
      {expertises.length > 0 ? (
        expertises.map((expertise) => (
          <ListItem key={expertise.id} disablePadding>
            <ListItemButton onClick={() => onExpertiseSelect(expertise.id)}>
              <ListItemText 
                primary={`Perícia de ${expertise.plaintiff} vs ${expertise.defendant}`} 
                secondary={expertise.dateTime ? new Date(expertise.dateTime).toLocaleDateString() : 'Data não definida'}
              />
            </ListItemButton>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="Nenhuma perícia encontrada para este caso" />
        </ListItem>
      )}
    </List>
  );
};

export default ExpertiseList;