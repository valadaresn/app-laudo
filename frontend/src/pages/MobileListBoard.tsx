import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ICase } from '../models/ICase';
import { Status, statusLabels } from '../models/Status';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import KanbanCard from '../components/kanbam/KanbanCard';

interface MobileListBoardProps {
  activeColumn: Status;
}

const MobileListBoard: React.FC<MobileListBoardProps> = ({ activeColumn }) => {
  const [cards, setCards] = useState<ICase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
      const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICase));
      setCards(cases);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (card: ICase) => {
    navigate(`/case-form/${card.id}`);
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
    <Container maxWidth={false} style={{ padding: 0, width: '100vw' }}>
      <Typography variant="h2" gutterBottom>
        {statusLabels[activeColumn]}
      </Typography>
      <Grid container spacing={0} style={{ width: '100%', margin: 0 }}>
        <Grid item xs={12}>
          <Box
            style={{
              padding: '16px',
              height: '100vh',
              width: '100vw',
              boxSizing: 'border-box',
            }}
          >
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default MobileListBoard;