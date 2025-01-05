import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICase, IScheduling } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const SchedulingForm: React.FC<{ card: ICase; onClose: () => void }> = ({ card, onClose }) => {
    const { register, handleSubmit } = useForm<IScheduling>({
        defaultValues: card.scheduling || {
            suggestedExpertiseDateAI: '',
            suggestedExpertiseDateExpert: '',
            contactsPerformed: false,
            expertiseDateConfirmedByPlaintiff: false,
            expertiseDateConfirmedByDefendant: false,
            finalExpertiseDate: ''
        }
    });

    const [activeTab, setActiveTab] = useState<'case' | 'scheduling'>('case');

    const onSubmit = async (data: IScheduling) => {
        const updatedCase: Partial<ICase> = {
            scheduling: data,
            status: data.finalExpertiseDate ? 'PERICIA' : 'AGENDAMENTO' // Alterar status para PERICIA se finalExpertiseDate estiver preenchido
        };

        try {
            const docRef = doc(db, 'cases', card.id!);
            await updateDoc(docRef, updatedCase);
            console.log('Document updated successfully');
        } catch (e) {
            console.error('Error updating document: ', e);
        }

        onClose();
    };

    return (
        <div className="form-container">
            <h2>Editar Agendamento</h2>
            <div className="tabs">
                <button className={activeTab === 'case' ? 'active' : ''} onClick={() => setActiveTab('case')}>Processo</button>
                <button className={activeTab === 'scheduling' ? 'active' : ''} onClick={() => setActiveTab('scheduling')}>Agendamento</button>
            </div>
            {activeTab === 'case' && (
                <div className="tab-content">
                    <div className="field">
                        <label>Autor:</label>
                        <label>{card.register.plaintiff}</label>
                    </div>
                    <div className="field">
                        <label>Réu:</label>
                        <label>{card.register.defendant}</label>
                    </div>
                    <div className="field">
                        <label>Identificador:</label>
                        <label>{card.register.expertiseIdentifier}</label>
                    </div>
                    <div className="field">
                        <label>Processo:</label>
                        <label>{card.register.caseNumber}</label>
                    </div>
                    <div className="field">
                        <label>Data Audiência:</label>
                        <label>{card.register.hearingDate as string}</label>
                    </div>
                    <div className="field">
                        <label>Email Adv. Réu:</label>
                        <label>{card.register.defendantLawyerEmail}</label>
                    </div>
                    <div className="field">
                        <label>Email Adv. Autor:</label>
                        <label>{card.register.plaintiffLawyerEmail}</label>
                    </div>
                    <div className="field">
                        <label>Aceita?</label>
                        <label>{card.register.acceptedPerformed ? 'Sim' : 'Não'}</label>
                    </div>
                    <div className="field">
                        <label>Objeto:</label>
                        <label>{card.register.expertiseSubject}</label>
                    </div>
                    <div className="field">
                        <label>URL Processo:</label>
                        <label>{card.register.casePdfUrl}</label>
                    </div>
                </div>
            )}
            {activeTab === 'scheduling' && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Data Sugerida pela IA</label>
                        <input
                            type="date"
                            {...register('suggestedExpertiseDateAI')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data Sugerida pelo Perito</label>
                        <input
                            type="date"
                            {...register('suggestedExpertiseDateExpert')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Contatos Realizados</label>
                        <input
                            type="checkbox"
                            {...register('contactsPerformed')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data Confirmada pelo Reclamante</label>
                        <input
                            type="checkbox"
                            {...register('expertiseDateConfirmedByPlaintiff')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data Confirmada pelo Réu</label>
                        <input
                            type="checkbox"
                            {...register('expertiseDateConfirmedByDefendant')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data Definitiva da Perícia</label>
                        <input
                            type="date"
                            {...register('finalExpertiseDate')}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Salvar</button>
                    </div>
                </form>
            )}
            <style>{`
                .form-container {
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #f4f4f4;
                    max-width: 600px;
                    margin: 20px auto;
                }
                .tabs {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                .tabs button {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-bottom: 2px solid transparent;
                    background-color: #f4f4f4;
                    cursor: pointer;
                }
                .tabs button.active {
                    border-bottom: 2px solid #007bff;
                }
                .field {
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;
                }
                .field label {
                    flex: 1;
                    font-weight: bold;
                }
                .field label + label {
                    flex: 2;
                    padding: 8px;
                    background-color: inherit;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .form-group .error {
                    color: red;
                    font-size: 12px;
                }
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .form-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .form-actions button[type="button"] {
                    background-color: #ccc;
                }
                .form-actions button[type="submit"] {
                    background-color: #007bff;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default SchedulingForm;