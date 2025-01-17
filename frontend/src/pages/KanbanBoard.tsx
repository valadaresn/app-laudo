import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CaseForm from './CaseForm';
import { ICase } from '../models/ICase';
import { Container, Grid, Box, Typography, Modal, useTheme, useMediaQuery } from '@mui/material';
import KanbanColumn from '../components/kanbam/KanbanColumn';
import MobileKanbanColumn from '../components/kanbam/MobileKanbanColumn';

const KanbanBoard: React.FC = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'expertise' | 'payment'>('register');
    const [cards, setCards] = useState<ICase[]>([]);
    const [activeColumn, setActiveColumn] = useState<'register' | 'scheduling' | 'expertise' | 'payment'>('register');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
            const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICase));
            console.log('Fetched cases:', cases); // Log dos dados puxados
            setCards(cases);
        });
        return () => unsubscribe();
    }, []);

    const handleCardClick = (cardId: string, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => {
        if (selectedCardId === cardId) {
            setFormOpen(false);
            setSelectedCardId(null);
        } else {
            setSelectedCardId(cardId);
            setActiveTab(tab);
            setFormOpen(true);
        }
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setSelectedCardId(null);
    };

    const columns = ['Cadastro', 'Agendamento', 'Perícia', 'Laudo'];

    return (
        <Container maxWidth={false} style={{ padding: 0, width: '100vw' }}>
            <Typography variant="h2" gutterBottom>
                Kanban Board
            </Typography>
            {isMobile ? (
                <Grid container spacing={0} style={{ width: '100%', margin: 0 }}>
                    <Grid item xs={12}>
                        <MobileKanbanColumn
                            activeColumn={activeColumn}
                            cards={cards}
                            handleCardClick={handleCardClick}
                            setActiveColumn={setActiveColumn}
                            setFormOpen={setFormOpen}
                            setActiveTab={setActiveTab}
                        />
                    </Grid>
                    {isFormOpen && (
                        <Grid item xs={12} style={{ padding: 0 }}>
                            <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                                <CaseForm
                                    cardId={selectedCardId}
                                    onClose={handleCloseForm}
                                    initialTab={activeTab}
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column}
                            title={column}
                            cards={cards}
                            handleCardClick={handleCardClick}
                            setFormOpen={setFormOpen}
                            setActiveTab={setActiveTab}
                            selectedCardId={selectedCardId} // Passe o selectedCardId para KanbanColumn
                        />
                    ))}
                </Grid>
            )}
            {isFormOpen && !isMobile && (
                <Modal open={isFormOpen} onClose={handleCloseForm}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '85%',
                            maxHeight: '90%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,
                            overflow: 'auto',
                            maxWidth: 700
                        }}
                    >
                        <CaseForm
                            cardId={selectedCardId}
                            onClose={handleCloseForm}
                            initialTab={activeTab}
                        />
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
            `}</style>
        </Container>
    );
};

export default KanbanBoard;