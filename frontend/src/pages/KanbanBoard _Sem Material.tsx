import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CaseForm from './CaseForm';
import { ICase } from '../models/ICase';

const KanbanBoard: React.FC = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<ICase | null>(null);
    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'expertise' | 'payment'>('register');
    const [cards, setCards] = useState<ICase[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
            const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ICase));
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
            .filter(card => card.status === status)
            .map((card, index) => (
                <div
                    key={index}
                    className={`card ${selectedCard?.id === card.id ? 'active' : ''}`}
                    onClick={() => handleCardClick(card, tab)}
                >
                    <h3>{`${card.register.plaintiff} vs ${card.register.defendant}`}</h3>
                </div>
            ));
    };

    return (
        <div className="kanban-board">
            <h2>KANBAN BOARD</h2>
            <div className="column">
                <h3>CADASTRO</h3>
                {renderCards('CADASTRO', 'register')}
                <button onClick={() => { setSelectedCard(null); setFormOpen(true); setActiveTab('register'); }}>Novo</button>
            </div>
            <div className="column">
                <h3>AGENDAMENTO</h3>
                {renderCards('AGENDAMENTO', 'scheduling')}
            </div>
            <div className="column">
                <h3>PERICIA</h3>
                {renderCards('PERICIA', 'expertise')}
            </div>
            <div className="column">
                <h3>LAUDO</h3>
                {renderCards('LAUDO', 'expertise')}
            </div>
            {isFormOpen && (
                <CaseForm card={selectedCard} onClose={handleCloseForm} initialTab={activeTab} />
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
                .card.active {
                    border-color: #007bff;
                    background-color: #e7f3ff;
                }
            `}</style>
        </div>
    );
};

export default KanbanBoard;