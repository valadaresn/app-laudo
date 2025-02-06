import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ICase } from '../models/ICase';
import { Status, statusLabels } from '../models/Status';
import { Container, Box, Button, useMediaQuery, useTheme } from '@mui/material';
import KanbanCard from '../components/kanbam/KanbanCard';
import CaseForm from './CaseForm';
import MobileListHeader from '../components/layout/mobile/MobileListHeader';
//import MobileBottomNav from '../components/layout/MobileBottonNav';
import MobileMenu from '../components/layout/mobile/MobileMenu';
import MobileListBottomNav from '../components/layout/mobile/MobileListBottonNav';


interface MobileListBoardProps {
  activeColumn: Status;
}

const MobileListBoard: React.FC<MobileListBoardProps> = ({ activeColumn }) => {
  const [cards, setCards] = useState<ICase[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [navValue, setNavValue] = useState<Status>(activeColumn);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    // Lógica para logout
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
    <Container style={{ paddingTop: isMobile ? '60px' : 0 }}>
      {isMobile && <MobileListHeader title={statusLabels[activeColumn]} onMenuClick={handleMenuClick} />}
      {menuOpen && <MobileMenu onLogout={handleLogout} onClose={handleMenuClose} />}
      {selectedCardId ? (
        <CaseForm caseId={selectedCardId} onClose={handleCloseForm} />
      ) : (
        <>
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
          <MobileListBottomNav value={navValue} onChange={(_, newValue) => setNavValue(newValue)} />
        </>
      )}
    </Container>
  );
};

export default MobileListBoard;