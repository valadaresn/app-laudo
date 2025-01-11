import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CaseForm from './CaseForm';
import { ICase } from '../models/ICase';
// import { Container, Paper, Typography, Button, Card, CardContent, useMediaQuery, useTheme, Checkbox, FormControlLabel, Modal, Box } from '@mui/material';
//import Grid from '@mui/material/Unstable_Grid2'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Container, Paper, Typography, Button, Card, CardContent, useMediaQuery, useTheme, Checkbox, FormControlLabel, Modal, Box, Grid } from '@mui/material';


// ► Importações recomendadas pela doc oficial do Swiper v10+
import 'swiper/css';              // CSS base
import 'swiper/css/navigation';   // Se for usar controles de navegação
import 'swiper/css/pagination';   // Se for usar paginação
// ► Para usar navegação/paginação, importe e registre os módulos
import { Navigation, Pagination } from 'swiper/modules';

const KanbanBoard: React.FC = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ICase | null>(null);
    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'expertise' | 'payment'>('register');
    const [cards, setCards] = useState<ICase[]>([]);
    const [activeStep, setActiveStep] = useState(0);
    const [isModal, setIsModal] = useState(false); // Estado para controlar o checkbox

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
                    style={{ marginBottom: '10px' }}
                >
                    <CardContent>
                        <Typography variant="h6">
                            {`${card.register.plaintiff} vs ${card.register.defendant}`}
                        </Typography>
                    </CardContent>
                </Card>
            ));
    };

    const columns = (
        <>
            <Grid xs={12} md={3}>
                <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
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
                </Paper>
            </Grid>
            <Grid xs={12} md={3}>
                <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Agendamento
                    </Typography>
                    {renderCards('AGENDAMENTO', 'scheduling')}
                </Paper>
            </Grid>
            <Grid xs={12} md={3}>
                <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Perícia
                    </Typography>
                    {renderCards('PERICIA', 'expertise')}
                </Paper>
            </Grid>
            <Grid xs={12} md={3}>
                <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Laudo
                    </Typography>
                    {renderCards('LAUDO', 'expertise')}
                </Paper>
            </Grid>
        </>
    );

    return (
        <Container maxWidth={false} style={{ padding: 0, width: '100vw' }}>
            <Typography variant="h2" gutterBottom>
                KANBAN
            </Typography>
            <FormControlLabel
                control={<Checkbox checked={isModal} onChange={(e) => setIsModal(e.target.checked)} />}
                label="Exibir CaseForm em Modal"
            />
            {isMobile ? (
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
                    onSwiper={(swiper) => setActiveStep(swiper.activeIndex)}
                >
                    <SwiperSlide>
                        <Grid xs={12} md={3}>
                            <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
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
                            </Paper>
                        </Grid>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Grid xs={12} md={3}>
                            <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Agendamento
                                </Typography>
                                {renderCards('AGENDAMENTO', 'scheduling')}
                            </Paper>
                        </Grid>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Grid xs={12} md={3}>
                            <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Perícia
                                </Typography>
                                {renderCards('PERICIA', 'expertise')}
                            </Paper>
                        </Grid>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Grid xs={12} md={3}>
                            <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Laudo
                                </Typography>
                                {renderCards('LAUDO', 'expertise')}
                            </Paper>
                        </Grid>
                    </SwiperSlide>
                </Swiper>
            ) : (
                <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                    {columns}
                    <Grid xs={12} md={3}>
                        {isFormOpen && !isModal && (
                            <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                                <CaseForm
                                    card={selectedCard}
                                    onClose={handleCloseForm}
                                    initialTab={activeTab}
                                />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            )}
            {isFormOpen && isModal && (
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
                            maxWidth: 700 // Adicionando largura máxima
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