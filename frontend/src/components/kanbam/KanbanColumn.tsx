import { Grid, Box, Typography, Button } from '@mui/material';
import { ICase } from '../../models/ICase';
import { Status } from '../../models/Status'; // Importar de Status.ts
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    title: Status;
    label: string; // Nova propriedade para o rótulo em português
    cards: ICase[];
    handleCardClick: (card: ICase) => void;
    setFormOpen: (open: boolean) => void;
    selectedCardId: string | null;
}

function KanbanColumn({ title, label, cards, handleCardClick, setFormOpen, selectedCardId }: KanbanColumnProps) {
    const renderCards = () => {
        return cards.filter(card => card.status === title).map((card, index) => (
            <KanbanCard
                key={index}
                card={card}
                handleCardClick={handleCardClick}
                isSelected={card.id === selectedCardId}
            />
        ));
    };

    return (
        <Grid item xs={12} md={3}>
            <Box
                sx={{
                    padding: '16px',
                    height: '100%',
                    //backgroundColor: '#d3d3d3', // Cor de fundo cinza mais escuro
                    backgroundColor: '#dcdcdc', // Cor de fundo cinza mais escuro
                    
                    borderRadius: '20px', // Cantos arredondados
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Sombra leve
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {label} {/* Usar a nova propriedade label */}
                </Typography>
                {renderCards()}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setFormOpen(true);
                    }}
                >
                    Novo
                </Button>
            </Box>
        </Grid>
    );
}

export default KanbanColumn;