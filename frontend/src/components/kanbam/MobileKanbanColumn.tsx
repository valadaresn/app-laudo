import { Grid, Box, Button } from '@mui/material';
import { ICase } from '../../models/ICase';
import { Status } from '../../models/Status';
import KanbanCard from './KanbanCard';

interface MobileKanbanColumnProps {
  activeColumn: Status;
  cards: ICase[];
  handleCardClick: (card: ICase) => void;
  setActiveColumn: (column: Status) => void;
  setFormOpen: (open: boolean) => void;
  selectedCardId: string | null;
}

function MobileKanbanColumn({
  activeColumn,
  cards,
  handleCardClick,
  setActiveColumn,
  setFormOpen,
  selectedCardId,
}: MobileKanbanColumnProps) {
  const handleCardClickAndOpenForm = (card: ICase) => {
    handleCardClick(card);
    setFormOpen(true);
  };

  const renderCards = (status: Status) => {
    return cards
      .filter((card) => card.status === status)
      .map((card, index) => (
        <KanbanCard
          key={index}
          card={card}
          handleCardClick={handleCardClickAndOpenForm}
          isSelected={card.id === selectedCardId}
        />
      ));
  };

  return (
    <Grid item xs={12} style={{ padding: 0 }}>
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
            setFormOpen(true);
            setActiveColumn('register');
          }}
        >
          Novo
        </Button>
      </Box>
    </Grid>
  );
}

export default MobileKanbanColumn;