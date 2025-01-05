import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICase, IScheduling } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const SchedulingForm: React.FC<{ card: ICase; onClose: () => void }> = ({ card, onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<IScheduling>({
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
                    <details>
                        <summary>Autor</summary>
                        <p>{card.register.plaintiff}</p>
                    </details>
                    <details>
                        <summary>Réu</summary>
                        <p>{card.register.defendant}</p>
                    </details>
                    <details>
                        <summary>Identificador Perícia</summary>
                        <p>{card.register.expertiseIdentifier}</p>
                    </details>
                    <details>
                        <summary>Processo</summary>
                        <p>{card.register.caseNumber}</p>
                    </details>
                    <details>
                        <summary>Data da Audiência</summary>
                        <p>{card.register.hearingDate as string}</p>
                    </details>
                    <details>
                        <summary>Email do Advogado do Réu</summary>
                        <p>{card.register.defendantLawyerEmail}</p>
                    </details>
                    <details>
                        <summary>Email do Advogado do Autor</summary>
                        <p>{card.register.plaintiffLawyerEmail}</p>
                    </details>
                    <details>
                        <summary>Aceita?</summary>
                        <p>{card.register.acceptedPerformed ? 'Sim' : 'Não'}</p>
                    </details>
                    <details>
                        <summary>Objeto</summary>
                        <p>{card.register.expertiseSubject}</p>
                    </details>
                    <details>
                        <summary>URL do Processo PDF</summary>
                        <p>{card.register.casePdfUrl}</p>
                    </details>
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
                .tab-content details {
                    margin-bottom: 15px;
                }
                .tab-content summary {
                    font-weight: bold;
                }
                .tab-content p {
                    margin: 0;
                    padding: 8px;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 4px;
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