import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { ICase } from '../../models/ICase';
import KanbanCard from './KambamCard';


interface KanbanColumnProps {
    title: string;
    cards: ICase[];
    handleCardClick: (card: ICase, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    setFormOpen: (open: boolean) => void;
    setActiveTab: (tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, cards, handleCardClick, setFormOpen, setActiveTab }) => {
    const status = title.toUpperCase() as ICase['status'];

    return (
        <Grid item xs={12} md={3}>
            <Box style={{ padding: '16px', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                {cards.filter(card => card.status === status).map((card, index) => (
                    <KanbanCard key={index} card={card} handleCardClick={handleCardClick} />
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