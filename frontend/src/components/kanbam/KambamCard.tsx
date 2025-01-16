import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ICase } from '../../models/ICase';
import { CardContainer } from './KanbanStyles';

interface KanbanCardProps {
    card: ICase;
    handleCardClick: (card: ICase, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => void;
    isSelected: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, handleCardClick, isSelected }) => {
    console.log(`Rendering card: ${card.id}, Selected: ${isSelected}`); // Log do card renderizado
    return (
        <CardContainer
            className={`card ${isSelected ? 'active' : ''}`}
            onClick={() => handleCardClick(card, 'register')}
        >
            <Card style={{ marginBottom: '10px', width: '100%', borderRadius: '8px' }}>
                <CardContent>
                    <Typography variant="h6">
                        {`${card.register.plaintiff} vs ${card.register.defendant}`}
                    </Typography>
                </CardContent>
            </Card>
        </CardContainer>
    );
};

export default KanbanCard;