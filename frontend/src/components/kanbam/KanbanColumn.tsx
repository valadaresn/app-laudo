import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import KanbanCard from './KambamCard';
import { ICase } from '../../models/ICase';

interface KanbanColumnProps {
    title: string;
    cards: ICase[];
    handleCardClick: (card: ICase, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    setFormOpen: (open: boolean) => void;
    setActiveTab: (tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    selectedCard: ICase | null;
}

const normalizeString = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, cards, handleCardClick, setFormOpen, setActiveTab, selectedCard }) => {
    const normalizedTitle = normalizeString(title);
    const filteredCards = cards.filter(card => normalizeString(card.status) === normalizedTitle);
    console.log(`Rendering column: ${title}, Cards:`, filteredCards); // Log dos cards filtrados

    return (
        <Grid item xs={12} md={3}>
            <Box
                sx={{
                    padding: '16px',
                    height: '100%',
                    backgroundColor: '#f4f5f7', // Cor de fundo cinza claro
                    borderRadius: '20px', // Cantos arredondados
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Sombra leve
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                {filteredCards.map((card, index) => (
                    <KanbanCard
                        key={index}
                        card={card}
                        handleCardClick={handleCardClick}
                        isSelected={card.id === selectedCard?.id}
                    />
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setFormOpen(true);
                        setActiveTab('register');
                    }}
                >
                    Novo
                </Button>
            </Box>
        </Grid>
    );
};

export default KanbanColumn;