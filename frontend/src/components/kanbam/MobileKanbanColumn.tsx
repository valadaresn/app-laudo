import React from 'react';
import { Grid, Box, Button } from '@mui/material';
import KanbanCard from './KambamCard';
import { ICase } from '../../models/ICase';

interface MobileKanbanColumnProps {
    activeColumn: 'register' | 'scheduling' | 'expertise' | 'payment';
    cards: ICase[];
    handleCardClick: (card: ICase, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    setActiveColumn: (column: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    setFormOpen: (open: boolean) => void;
    setActiveTab: (tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
}

const MobileKanbanColumn: React.FC<MobileKanbanColumnProps> = ({ activeColumn, cards, handleCardClick, setActiveColumn, setFormOpen, setActiveTab }) => {
    const renderCards = (status: ICase['status']) => {
        return cards.filter(card => card.status === status).map((card, index) => (
            <KanbanCard key={index} card={card} handleCardClick={handleCardClick} />
        ));
    };

    return (
        <Grid item xs={12} style={{ padding: 0 }}>
            <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                {activeColumn === 'register' && renderCards('Cadastro')}
                {activeColumn === 'scheduling' && renderCards('Agendamento')}
                {activeColumn === 'expertise' && renderCards('Perícia')}
                {activeColumn === 'payment' && renderCards('Laudo')}
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

export default MobileKanbanColumn;