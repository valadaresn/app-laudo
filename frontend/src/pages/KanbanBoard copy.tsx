import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CadastroForm from './CadastroForm';
import SchedulingForm from './SchedulingForm';
import { ICase } from '../models/ICase';

const KanbanBoard: React.FC = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ICase | null>(null);
    const [cards, setCards] = useState<ICase[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
            const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ICase));
            setCards(cases);
        });

        return () => unsubscribe();
    }, []);

    const handleCardClick = (card: ICase) => {
        setSelectedCard(card);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setSelectedCard(null);
    };

    const renderCards = (status: ICase['status']) => {
        return cards
            .filter(card => card.status === status)
            .map((card, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(card)}>
                    <h3>{`${card.register.plaintiff} vs ${card.register.defendant}`}</h3>
                </div>
            ));
    };

    return (
        <div className="kanban-board">
            <h2>KANBAN BOARD</h2>
            <div className="column">
                <h3>CADASTRO</h3>
                {renderCards('CADASTRO')}
                <button onClick={() => { setSelectedCard(null); setFormOpen(true); }}>Novo</button>
            </div>
            <div className="column">
                <h3>AGENDAMENTO</h3>
                {renderCards('AGENDAMENTO')}
            </div>
            <div className="column">
                <h3>PERICIA</h3>
                {renderCards('PERICIA')}
            </div>
            <div className="column">
                <h3>LAUDO</h3>
                {renderCards('LAUDO')}
            </div>
            {isFormOpen && selectedCard?.status === 'CADASTRO' && (
                <CadastroForm key={selectedCard?.id} card={selectedCard} onClose={handleCloseForm} />
            )}
            {isFormOpen && selectedCard?.status === 'AGENDAMENTO' && (
                <SchedulingForm key={selectedCard?.id} card={selectedCard} onClose={handleCloseForm} />
            )}
            <style>{`
                .kanban-board {
                    display: flex;
                    justify-content: space-between;
                    padding: 20px;
                }
                .column {
                    flex: 1;
                    margin: 0 10px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #f4f4f4;
                }
                .column h3 {
                    text-align: center;
                }
                .column button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .column button:hover {
                    background-color: #0056b3;
                }
                .card {
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: white;
                    cursor: pointer;
                }
                .card:hover {
                    background-color: #f0f0f0;
                }
            `}</style>
        </div>
    );
};

export default KanbanBoard;