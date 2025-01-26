import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { IExpertise } from '../../models/ICase';
import { db } from '../../firebaseConfig';
//import { db } from '../firebaseConfig';
//import { IExpertise } from '../models/ICase';

interface ExpertiseListProps {
  caseId: string;
  onExpertiseSelect: (expertiseId: string) => void;
}

const ExpertiseList: React.FC<ExpertiseListProps> = ({ caseId, onExpertiseSelect }) => {
  const [expertises, setExpertises] = useState<IExpertise[]>([]);

  useEffect(() => {
    if (caseId) {
      const q = query(collection(db, 'expertises'), where('caseId', '==', caseId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expertiseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as IExpertise[];
        setExpertises(expertiseList);
      });
      return () => unsubscribe();
    }
  }, [caseId]);

  return (
    <List>
      {expertises.map((expertise) => (
        <ListItem key={expertise.id} disablePadding>
          <ListItemButton onClick={() => onExpertiseSelect(expertise.id)}>
            <ListItemText primary={`Perícia em ${expertise.plaintiff}`} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ExpertiseList;