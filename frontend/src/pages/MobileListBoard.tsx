import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ICase } from '../models/ICase';
import { Status, statusLabels } from '../models/Status';
import { Container, Typography, Box, Button } from '@mui/material';
import KanbanCard from '../components/kanbam/KanbanCard';
import CaseForm from './CaseForm';

interface MobileListBoardProps {
  activeColumn: Status;
}

const MobileListBoard: React.FC<MobileListBoardProps> = ({ activeColumn }) => {
  const [cards, setCards] = useState<ICase[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
      const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICase));
      setCards(cases);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (card: ICase) => {
    setSelectedCardId(card.id);
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
    <Container maxWidth={false} style={{ padding: 16 }}>
      {/* <Container maxWidth={false} style={{ padding: 0 }}> */}
      {selectedCardId ? (
        <CaseForm cardId={selectedCardId} onClose={handleCloseForm} />
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
        </>
      )}
    </Container>
  );
};

export default MobileListBoard;