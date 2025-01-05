import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICase, IScheduling } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const SchedulingForm: React.FC<{ card: ICase; onClose: () => void }> = ({ card, onClose }) => {
    const { register, handleSubmit, setValue } = useForm<ICase>({
        defaultValues: card
    });

    const [activeTab, setActiveTab] = useState<'case' | 'scheduling'>('case');
    const [isEditing, setIsEditing] = useState(false);

    const onSubmit = async (data: ICase) => {
        const updatedCase: Partial<ICase> = {
            ...data,
            status: data.scheduling?.finalExpertiseDate ? 'PERICIA' : 'AGENDAMENTO' // Alterar status para PERICIA se finalExpertiseDate estiver preenchido
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="form-container">
            <h2>Editar Agendamento</h2>
            <div className="tabs">
                <button className={activeTab === 'case' ? 'active' : ''} onClick={() => setActiveTab('case')}>Processo</button>
                <button className={activeTab === 'scheduling' ? 'active' : ''} onClick={() => setActiveTab('scheduling')}>Agendamento</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {activeTab === 'case' && (
                    <>
                        <div className="form-group">
                            <label>Autor</label>
                            <input
                                type="text"
                                {...register('register.plaintiff')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Réu</label>
                            <input
                                type="text"
                                {...register('register.defendant')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Identificador Perícia</label>
                            <input
                                type="text"
                                {...register('register.expertiseIdentifier')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Processo</label>
                            <input
                                type="text"
                                {...register('register.caseNumber')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Audiência</label>
                            <input
                                type="date"
                                {...register('register.hearingDate')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Adv. Réu</label>
                            <input
                                type="email"
                                {...register('register.defendantLawyerEmail')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Adv. Autor</label>
                            <input
                                type="email"
                                {...register('register.plaintiffLawyerEmail')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Aceita?</label>
                            <input
                                type="checkbox"
                                {...register('register.acceptedPerformed')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>Objeto</label>
                            <input
                                type="text"
                                {...register('register.expertiseSubject')}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <label>URL Processo</label>
                            <input
                                type="url"
                                {...register('register.casePdfUrl')}
                                disabled={!isEditing}
                            />
                        </div>
                        {isEditing ? (
                            <div className="form-actions">
                                <button type="button" onClick={handleCancel}>Cancelar</button>
                                <button type="submit">Salvar</button>
                            </div>
                        ) : (
                            <div className="form-actions">
                                <button type="button" onClick={handleEdit}>Editar</button>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'scheduling' && (
                    <>
                        <div className="form-group">
                            <label>Data Sugerida pela IA</label>
                            <input
                                type="date"
                                {...register('scheduling.suggestedExpertiseDateAI')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Sugerida pelo Perito</label>
                            <input
                                type="date"
                                {...register('scheduling.suggestedExpertiseDateExpert')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contatos Realizados</label>
                            <input
                                type="checkbox"
                                {...register('scheduling.contactsPerformed')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Confirmada pelo Reclamante</label>
                            <input
                                type="checkbox"
                                {...register('scheduling.expertiseDateConfirmedByPlaintiff')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Confirmada pelo Réu</label>
                            <input
                                type="checkbox"
                                {...register('scheduling.expertiseDateConfirmedByDefendant')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Definitiva da Perícia</label>
                            <input
                                type="date"
                                {...register('scheduling.finalExpertiseDate')}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={onClose}>Cancelar</button>
                            <button type="submit">Salvar</button>
                        </div>
                    </>
                )}
            </form>
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
                .form-group input[type="checkbox"] {
                    width: auto;
                    padding: 0;
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
                .form-actions button[type="submit"], .form-actions button[type="button"]:not([type="button"]) {
                    background-color: #007bff;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default SchedulingForm;