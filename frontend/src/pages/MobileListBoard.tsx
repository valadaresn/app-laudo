import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ICase, defaultValues } from '../models/ICase';
import { Status, statusLabels } from '../models/Status';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import KanbanCard from '../components/kanbam/KanbanCard';
import CaseForm from './CaseForm';
import MobileListHeader from '../components/layout/mobile/MobileListHeader';
import MobileMenu from '../components/layout/mobile/MobileMenu';
import MobileListBottomNav from '../components/layout/mobile/MobileListBottonNav';

interface MobileListBoardProps {
  activeColumn: Status;
}

const MobileListBoard: React.FC<MobileListBoardProps> = ({ activeColumn }) => {
  const [cards, setCards] = useState<ICase[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
      const cases = snapshot.docs.map((doc) => {
        // Mesclar com defaultValues para garantir que todos os campos existam
        return { ...defaultValues, id: doc.id, ...doc.data() } as ICase;
      });
      setCards(cases);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (card: ICase) => {
    setSelectedCardId(card.id ?? null);
  };

  const handleCloseForm = () => {
    setSelectedCardId(null);
    setIsCreatingNew(false);
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

  const handleNewCase = () => {
    if (isMobile) {
      setIsCreatingNew(true);
    } else {
      navigate('/case-form/new');
    }
  };

  const renderCards = (status: Status) => {
    const filteredCards = cards.filter((card) => card.status === status);

    if (filteredCards.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Nenhum caso encontrado com status: {statusLabels[status]}
        </Typography>
      );
    }

    return filteredCards.map((card, index) => (
      <KanbanCard
        key={card.id || index}
        card={card}
        handleCardClick={handleCardClick}
        isSelected={card.id === selectedCardId}
      />
    ));
  };

  return (
    <Box style={{ paddingTop: isMobile ? '65px' : 0 }}>
      {isMobile && (
        <MobileListHeader
          title={statusLabels[activeColumn] || 'Casos'}
          onMenuClick={handleMenuClick}
        />
      )}
      {menuOpen && <MobileMenu onLogout={handleLogout} onClose={handleMenuClose} />}
      {selectedCardId ? (
        <CaseForm caseId={selectedCardId} onClose={handleCloseForm} />
      ) : isCreatingNew ? (
        <CaseForm caseId={null} onClose={handleCloseForm} />
      ) : (
        <>
          <Box>
            {renderCards(activeColumn)}
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewCase}
              sx={{ mt: 2 }}
            >
              Novo
            </Button>
          </Box>
          <MobileListBottomNav
            value={activeColumn}
            onChange={(_, newValue) => {
              // activeColumn é controlada externamente (via prop)
              void newValue; // Evita o aviso de variável não utilizada
            }}
          />

        </>
      )}
    </Box>
  );
};

export default MobileListBoard;