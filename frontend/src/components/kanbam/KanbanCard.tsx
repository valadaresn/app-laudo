import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ICase, defaultValues } from '../../models/ICase';
import { CardContainer } from './KanbanStyles';

interface KanbanCardProps {
    card: Partial<ICase>;
    handleCardClick: (card: ICase) => void;
    isSelected: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, handleCardClick, isSelected }) => {
    // Mesclamos com os valores padrão para garantir que todos os campos existam
    const safeCard = { ...defaultValues, ...card } as ICase;
    
    console.log(`Rendering card: ${safeCard.id}, Selected: ${isSelected}`); // Log do card renderizado
    
    return (
        <CardContainer
            className={`card ${isSelected ? 'active' : ''}`}
            onClick={() => handleCardClick(safeCard)}
        >
            <Card style={{ marginBottom: '10px', borderRadius: '8px' }}>
                <CardContent>
                    <Typography variant="h6">
                        {`${safeCard.plaintiff} vs ${safeCard.defendant}`}
                    </Typography>
                    {safeCard.caseNumber && (
                        <Typography variant="body2" color="text.secondary">
                            {safeCard.caseNumber}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </CardContainer>
    );
};

export default KanbanCard;