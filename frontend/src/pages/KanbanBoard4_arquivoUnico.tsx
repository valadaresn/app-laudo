import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CaseForm from './CaseForm';
import { ICase } from '../models/ICase';
import { Container, Typography, Button, Card, CardContent, useMediaQuery, useTheme, Checkbox, FormControlLabel, Modal, Box, Grid } from '@mui/material';

const KanbanBoard: React.FC = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ICase | null>(null);
    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'expertise' | 'payment'>('register');
    const [cards, setCards] = useState<ICase[]>([]);
    const [isModal, setIsModal] = useState(false);
    const [activeColumn, setActiveColumn] = useState<'register' | 'scheduling' | 'expertise' | 'payment'>('register');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
            const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICase));
            setCards(cases);
        });
        return () => unsubscribe();
    }, []);

    const handleCardClick = (card: ICase, tab: 'register' | 'scheduling' | 'expertise' | 'payment') => {
        if (selectedCard?.id === card.id) {
            setFormOpen(false);
            setSelectedCard(null);
        } else {
            setSelectedCard(card);
            setActiveTab(tab);
            setFormOpen(true);
        }
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setSelectedCard(null);
    };

    const renderCards = (status: ICase['status'], tab: 'register' | 'scheduling' | 'expertise' | 'payment') => {
        return cards
            .filter((card) => card.status === status)
            .map((card, index) => (
                <Card
                    key={index}
                    className={`card ${selectedCard?.id === card.id ? 'active' : ''}`}
                    onClick={() => handleCardClick(card, tab)}
                    style={{ marginBottom: '10px', width: '100%' }} // Ensure cards occupy 100% width
                >
                    <CardContent>
                        <Typography variant="h6">
                            {`${card.register.plaintiff} vs ${card.register.defendant}`}
                        </Typography>
                    </CardContent>
                </Card>
            ));
    };

    const renderMobileColumn = () => {
        switch (activeColumn) {
            case 'register':
                return (
                    <Grid item xs={12} style={{ padding: 0 }}>
                        <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                            {renderCards('CADASTRO', 'register')}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setSelectedCard(null);
                                    setFormOpen(true);
                                    setActiveTab('register');
                                }}
                            >
                                Novo
                            </Button>
                        </Box>
                    </Grid>
                );
            case 'scheduling':
                return (
                    <Grid item xs={12} style={{ padding: 0 }}>
                        <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                            {renderCards('AGENDAMENTO', 'scheduling')}
                        </Box>
                    </Grid>
                );
            case 'expertise':
                return (
                    <Grid item xs={12} style={{ padding: 0 }}>
                        <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                            {renderCards('PERICIA', 'expertise')}
                        </Box>
                    </Grid>
                );
            case 'payment':
                return (
                    <Grid item xs={12} style={{ padding: 0 }}>
                        <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                            {renderCards('LAUDO', 'expertise')}
                        </Box>
                    </Grid>
                );
            default:
                return null;
        }
    };

    const columns = (
        <>
            <Grid item xs={12} md={3}>
                <Box style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Cadastro
                    </Typography>
                    {renderCards('CADASTRO', 'register')}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setSelectedCard(null);
                            setFormOpen(true);
                            setActiveTab('register');
                        }}
                    >
                        Novo
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Agendamento
                    </Typography>
                    {renderCards('AGENDAMENTO', 'scheduling')}
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Perícia
                    </Typography>
                    {renderCards('PERICIA', 'expertise')}
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Laudo
                    </Typography>
                    {renderCards('LAUDO', 'expertise')}
                </Box>
            </Grid>
        </>
    );

    return (
        <Container maxWidth={false} style={{ padding: 0, width: '100vw' }}>
            <Typography variant="h2" gutterBottom>
                
            </Typography>
            {!isMobile && (
                <FormControlLabel
                    control={<Checkbox checked={isModal} onChange={(e) => setIsModal(e.target.checked)} />}
                    label="Exibir CaseForm em Modal"
                />
            )}
            {isMobile ? (
                <Grid container spacing={0} style={{ width: '100%', margin: 0 }}>
                    <Grid item xs={12}>
                        {renderMobileColumn()}
                    </Grid>
                    {isFormOpen && (
                        <Grid item xs={12} style={{ padding: 0 }}>
                            <Box style={{ padding: '16px', height: '100vh', width: '100vw', boxSizing: 'border-box' }}>
                                <CaseForm
                                    card={selectedCard}
                                    onClose={handleCloseForm}
                                    initialTab={activeTab}
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                    {columns}
                    <Grid item xs={12} md={3}>
                        {isFormOpen && !isModal && (
                            <Box style={{ padding: '16px', height: '100%' }}>
                                <CaseForm
                                    card={selectedCard}
                                    onClose={handleCloseForm}
                                    initialTab={activeTab}
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            )}
            {isFormOpen && isModal && !isMobile && (
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
                            card={selectedCard}
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