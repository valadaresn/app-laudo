import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ICase } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

const CaseForm: React.FC<{ card: ICase | null; onClose: () => void; initialTab: 'register' | 'scheduling' | 'expertiseReport' | 'payment' }> = ({ card, onClose, initialTab }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ICase>({
        defaultValues: {
            register: {
                plaintiff: '',
                defendant: '',
                expertiseIdentifier: '',
                caseNumber: '',
                hearingDate: '',
                defendantLawyerEmail: '',
                plaintiffLawyerEmail: '',
                acceptedPerformed: false,
                expertiseSubject: '',
                casePdfUrl: '',
                registerProgress: 0
            },
            scheduling: {
                suggestedExpertiseDateAI: '',
                suggestedExpertiseDateExpert: '',
                contactsPerformed: false,
                expertiseDateConfirmedByPlaintiff: false,
                expertiseDateConfirmedByDefendant: false,
                finalExpertiseDate: ''
            },
            expertiseReport: {
                expertiseReportUrl: '',
                expertiseReportSentAt: '',
                expertiseReportProgress: 0
            },
            payment: {
                isPaid: false,
                feeAmount: 0
            },
            status: 'CADASTRO'
        }
    });

    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'expertiseReport' | 'payment'>(initialTab);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (card) {
            reset(card);
        } else {
            reset({
                register: {
                    plaintiff: '',
                    defendant: '',
                    expertiseIdentifier: '',
                    caseNumber: '',
                    hearingDate: '',
                    defendantLawyerEmail: '',
                    plaintiffLawyerEmail: '',
                    acceptedPerformed: false,
                    expertiseSubject: '',
                    casePdfUrl: '',
                    registerProgress: 0
                },
                scheduling: {
                    suggestedExpertiseDateAI: '',
                    suggestedExpertiseDateExpert: '',
                    contactsPerformed: false,
                    expertiseDateConfirmedByPlaintiff: false,
                    expertiseDateConfirmedByDefendant: false,
                    finalExpertiseDate: ''
                },
                expertiseReport: {
                    expertiseReportUrl: '',
                    expertiseReportSentAt: '',
                    expertiseReportProgress: 0
                },
                payment: {
                    isPaid: false,
                    feeAmount: 0
                },
                status: 'CADASTRO'
            });
        }
        setActiveTab(initialTab);
    }, [card, initialTab, reset]);

    const onSubmit = async (data: ICase) => {
        try {
            if (card?.id) {
                // Update existing document
                const docRef = doc(db, 'cases', card.id);
                await updateDoc(docRef, data);
            } else {
                // Add new document
                await addDoc(collection(db, 'cases'), data);
            }
            console.log('Document written successfully');
        } catch (e) {
            console.error('Error adding document: ', e);
        }

        onClose();
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const renderTabs = () => {
        const tabs = [];
        switch (card?.status) {
            case 'CADASTRO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                break;
            case 'AGENDAMENTO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'scheduling', label: 'Agendamento' });
                break;
            case 'PERICIA':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'scheduling', label: 'Agendamento' });
                tabs.push({ key: 'expertiseReport', label: 'Laudo' });
                break;
            case 'LAUDO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'expertiseReport', label: 'Laudo' });
                break;
            case 'RECEBIMENTO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'expertiseReport', label: 'Laudo' });
                tabs.push({ key: 'payment', label: 'Recebimento' });
                break;
            default:
                tabs.push({ key: 'register', label: 'Cadastro' });
                break;
        }
        return tabs;
    };

    return (
        <div className="form-container">
            <h2>{card ? 'Editar Caso' : 'Novo Caso'}</h2>
            <div className="tabs">
                {renderTabs().map(tab => (
                    <button
                        key={tab.key}
                        className={activeTab === tab.key ? 'active' : ''}
                        onClick={() => setActiveTab(tab.key as 'register' | 'scheduling' | 'expertiseReport' | 'payment')}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {activeTab === 'register' && (
                    <>
                        <div className="form-group">
                            <label>Autor</label>
                            <input
                                type="text"
                                {...register('register.plaintiff', { required: 'Autor é obrigatório' })}
                                disabled={!isEditing}
                            />
                            {errors.register?.plaintiff && <span className="error">{errors.register.plaintiff.message}</span>}
                        </div>
                        <div className="form-group">
                            <label>Réu</label>
                            <input
                                type="text"
                                {...register('register.defendant', { required: 'Réu é obrigatório' })}
                                disabled={!isEditing}
                            />
                            {errors.register?.defendant && <span className="error">{errors.register.defendant.message}</span>}
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
                                {...register('register.caseNumber', { required: 'Processo é obrigatório' })}
                                disabled={!isEditing}
                            />
                            {errors.register?.caseNumber && <span className="error">{errors.register.caseNumber.message}</span>}
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
                            <label>
                                <input
                                    type="checkbox"
                                    {...register('register.acceptedPerformed')}
                                    disabled={!isEditing}
                                />
                                Aceita?
                            </label>
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
                            <label>URL do Processo PDF</label>
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
                {activeTab === 'expertiseReport' && (
                    <>
                        <div className="form-group">
                            <label>URL do Laudo</label>
                            <input
                                type="url"
                                {...register('expertiseReport.expertiseReportUrl')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Data de Envio do Laudo</label>
                            <input
                                type="date"
                                {...register('expertiseReport.expertiseReportSentAt')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Progresso do Laudo</label>
                            <input
                                type="number"
                                {...register('expertiseReport.expertiseReportProgress')}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={onClose}>Cancelar</button>
                            <button type="submit">Salvar</button>
                        </div>
                    </>
                )}
                {activeTab === 'payment' && (
                    <>
                        <div className="form-group">
                            <label>Recebido</label>
                            <input
                                type="checkbox"
                                {...register('payment.isPaid')}
                            />
                        </div>
                        <div className="form-group">
                            <label>Valor Honorário</label>
                            <input
                                type="number"
                                {...register('payment.feeAmount')}
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

export default CaseForm;