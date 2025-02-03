import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ICase } from '../models/ICase';
import { Status, statusLabels } from '../models/Status'; // Corrigir o caminho da importação
import { Container, Typography, Box, Button } from '@mui/material';
import KanbanCard from '../components/kanbam/KanbanCard';
import CaseForm from './CaseForm';
import MobileBottomNav from '../components/layout/MobileBottonNav';
//import MobileBottomNav from '../components/layout/MobileBottomNav';

interface MobileListBoardProps {
  activeColumn: Status;
}

const MobileListBoard: React.FC<MobileListBoardProps> = ({ activeColumn }) => {
  const [cards, setCards] = useState<ICase[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [navValue, setNavValue] = useState<Status>(activeColumn);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
      const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICase));
      setCards(cases);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (card: ICase) => {
    setSelectedCardId(card.id ?? null);
  };

  const handleCloseForm = () => {
    setSelectedCardId(null);
  };

  const renderCards = (status: Status) => {
    return cards
      .filter((card) => card.status === status)
      .map((card, index) => (
        <KanbanCard
          key={index}
          card={card}
          handleCardClick={handleCardClick}
          isSelected={false}
        />
      ));
  };

  return (
    <Container>
      {selectedCardId ? (
        <CaseForm caseId={selectedCardId} onClose={handleCloseForm} />
      ) : (
        <>
          <Typography variant="h2" gutterBottom>
            {statusLabels[activeColumn]}
          </Typography>
          <Box style={{ boxSizing: 'border-box' }}>
            {renderCards(activeColumn)}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate('/case-form/new');
              }}
            >
              Novo
            </Button>
          </Box>
          <MobileBottomNav value={navValue} onChange={(_, newValue) => setNavValue(newValue)} />
        </>
      )}
    </Container>
  );
};

export default MobileListBoard;