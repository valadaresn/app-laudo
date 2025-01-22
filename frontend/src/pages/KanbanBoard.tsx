import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CaseForm from './CaseForm';
import { ICase } from '../models/ICase';
import { Status, statusLabels } from '../models/Status';
import { Container, Grid, Typography, Modal, Box } from '@mui/material';
import KanbanColumn from '../components/kanbam/KanbanColumn';

const KanbanBoard: React.FC = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [cards, setCards] = useState<ICase[]>([]);
    const [isExpertiseFormOpen, setExpertiseFormOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
            const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICase));
            console.log('Fetched cases:', cases); // Log dos dados puxados
            setCards(cases);
        });
        return () => unsubscribe();
    }, []);

    const handleCardClick = (card: ICase) => {
        if (selectedCardId === card.id) {
            setFormOpen(false);
            setSelectedCardId(null);
        } else {
            setSelectedCardId(card.id ?? null); // Garantir que o valor seja string ou null
            setFormOpen(true);
        }
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setSelectedCardId(null);
    };

    const columns: Status[] = ['register', 'scheduling', 'expertise', 'report', 'payment'];

    return (
        <Container maxWidth={false} style={{ padding: 0, width: '100vw' }}>
            <Typography variant="h2" gutterBottom>
                Kanban Board
            </Typography>
            <Grid container spacing={3} style={{ width: '100%', margin: 0, flexWrap: 'nowrap' }}>
                {columns.map((column) => (
                    <KanbanColumn
                        key={column}
                        title={column}
                        label={statusLabels[column]}
                        cards={cards}
                        handleCardClick={handleCardClick}
                        setFormOpen={setFormOpen}
                        selectedCardId={selectedCardId}
                    />
                ))}
            </Grid>
            {/* {isFormOpen && !isExpertiseFormOpen && ( */}
            {isFormOpen && (                
                <Modal
                    open={isFormOpen}
                    onClose={(_, reason) => {
                        if (reason === 'backdropClick') return; // Evita fechar ao clicar na backdrop
                        handleCloseForm();
                    }}
                >
                    <Box className="modal-box">
                        <CaseForm cardId={selectedCardId} onClose={handleCloseForm} />
                    </Box>
                </Modal>
            )}

            <style>{`
                .card {
                    cursor: pointer;
                }
                .card.active {
                    border-color: #007bff;
                    background-color: #e7f3ff;
                }
                .modal-box {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 85%;
                    max-height: 90%;
                    background-color: #fff;
                    box-shadow: 24px;
                    padding: 16px;                                      
                    overflow: auto;
                    max-width: 700px;
                    border: 1px solid #ccc; /* Adiciona uma borda cinza */
                }
            `}</style>
        </Container>
    );
};

export default KanbanBoard;