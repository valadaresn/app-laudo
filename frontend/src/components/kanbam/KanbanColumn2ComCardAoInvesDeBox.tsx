import React from 'react';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import KanbanCard from './KanbanCard';
import { ICase } from '../../models/ICase';

interface KanbanColumnProps {
    title: string;
    cards: ICase[];
    handleCardClick: (card: ICase, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    setFormOpen: (open: boolean) => void;
    setActiveTab: (tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    selectedCard: ICase | null; // Adicione a prop selectedCard
}

const statusMap: { [key: string]: ICase['status'] } = {
    'Cadastro': 'CADASTRO',
    'Agendamento': 'AGENDAMENTO',
    'Perícia': 'PERICIA',
    'Laudo': 'LAUDO'
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, cards, handleCardClick, setFormOpen, setActiveTab, selectedCard }) => {
    const status = statusMap[title];
    console.log(`Title: ${title}, Status: ${status}`); // Verificação do título e status

    return (
        <Grid item xs={12} md={3}>
            <Card style={{ padding: '16px', height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    {cards.filter(card => card.status === status).map((card, index) => (
                        <KanbanCard
                            key={index}
                            card={card}
                            handleCardClick={handleCardClick}
                            isSelected={card.id === selectedCard?.id} // Verifique se o card está selecionado
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
                </CardContent>
            </Card>
        </Grid>
    );
};

export default KanbanColumn;