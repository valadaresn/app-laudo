import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICase, CaseSchema } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import RegisterForm from '../components/caseForm/RegisterForm';
import SchedulingForm from '../components/caseForm/SchedulingForm';
import ReportForm from '../components/caseForm/ReportForm';
import PaymentForm from '../components/caseForm/PaymentForm';
import ExpertiseForm from '../components/caseForm/ExpertiseForm';

const CaseForm: React.FC<{ card: ICase | null; onClose: () => void; initialTab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' }> = ({ card, onClose, initialTab }) => {
    const { register, handleSubmit, reset, watch, formState: { errors }, getValues } = useForm<ICase>({
        resolver: zodResolver(CaseSchema),
        defaultValues: CaseSchema.parse({
            register: {},
            scheduling: {},
            expertiseReport: {},
            payment: {},
            expertise: {}
        })
    });

    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion'>(initialTab);
    const [isEditing, setIsEditing] = useState(false);
    const initialValuesRef = useRef<ICase | null>(null);

    const finalExpertiseDate = watch('scheduling.finalExpertiseDate');
    const briefConclusion = watch('expertise.briefConclusion');

    useEffect(() => {
        if (card) {
            reset(card);
            initialValuesRef.current = card;
        } else {
            const defaultValues = CaseSchema.parse({
                register: {},
                scheduling: {},
                expertiseReport: {},
                payment: {},
                expertise: {}
            });
            reset(defaultValues);
            initialValuesRef.current = defaultValues;
        }
        setActiveTab(initialTab);
    }, [card, initialTab, reset]);

    const hasChanges = (currentValues: ICase, initialValues: ICase | null) => {
        if (!initialValues) return true;
        return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    };

    useEffect(() => {
        const saveData = async () => {
            const currentValues = getValues();
            if (hasChanges(currentValues, initialValuesRef.current) && card?.id) {
                const docRef = doc(db, 'cases', card.id);
                const updateData = {
                    register: currentValues.register,
                    scheduling: currentValues.scheduling,
                    expertiseReport: currentValues.expertiseReport,
                    payment: currentValues.payment,
                    expertise: currentValues.expertise,
                    status: currentValues.status
                };
                await updateDoc(docRef, updateData);
                initialValuesRef.current = currentValues;
            }
        };

        if (activeTab !== 'register') {
            saveData();
        }
    }, [activeTab, card, getValues]);

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
        const today = new Date().toISOString().split('T')[0];

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
                if (finalExpertiseDate !== today) {
                    tabs.push({ key: 'expertise', label: 'Perícia' });
                } else {
                    tabs.push({ key: 'participants', label: 'Participants' });
                    tabs.push({ key: 'procedure', label: 'Procedure' });
                    tabs.push({ key: 'parameters', label: 'Parameters' });
                    tabs.push({ key: 'analysis', label: 'Analysis' });
                    tabs.push({ key: 'briefConclusion', label: 'Brief Conclusion' });
                }
                break;
            case 'LAUDO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'report', label: 'Laudo' });
                break;
            case 'RECEBIMENTO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'report', label: 'Laudo' });
                tabs.push({ key: 'payment', label: 'Recebimento' });
                break;
            default:
                tabs.push({ key: 'register', label: 'Cadastro' });
                break;
        }

        if (briefConclusion) {
            tabs.push({ key: 'report', label: 'Laudo' });
        }

        return tabs;
    };

    return (
        <div className="form-container">
            <h2>{card ? 'Editar Caso' : 'Novo Caso'}</h2>
            <div className="tabs-container">
                <div className="tabs">
                    {renderTabs().map(tab => (
                        <button
                            key={tab.key}
                            className={activeTab === tab.key ? 'active' : ''}
                            onClick={() => setActiveTab(tab.key as 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion')}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {activeTab === 'register' && (
                    <RegisterForm register={register} errors={errors} isEditing={isEditing} handleEdit={handleEdit} handleCancel={handleCancel} />
                )}
                {activeTab === 'scheduling' && (
                    <SchedulingForm register={register} errors={errors} />
                )}
                {activeTab === 'expertise' && (
                    <div className="form-group">
                        <label>Data Perícia</label>
                        <input
                            type="date"
                            {...register('scheduling.finalExpertiseDate')}
                        />
                    </div>
                )}
                {activeTab === 'participants' && (
                    <ExpertiseForm register={register} errors={errors} field="participants" cardId={card?.id} getValues={getValues} />
                )}
                {activeTab === 'procedure' && (
                    <ExpertiseForm register={register} errors={errors} field="procedure" cardId={card?.id} getValues={getValues} />
                )}
                {activeTab === 'parameters' && (
                    <ExpertiseForm register={register} errors={errors} field="parameters" cardId={card?.id} getValues={getValues} />
                )}
                {activeTab === 'analysis' && (
                    <ExpertiseForm register={register} errors={errors} field="analysis" cardId={card?.id} getValues={getValues} />
                )}
                {activeTab === 'briefConclusion' && (
                    <ExpertiseForm register={register} errors={errors} field="briefConclusion" cardId={card?.id} getValues={getValues} />
                )}
                {activeTab === 'report' && (
                    <ReportForm register={register} errors={errors} />
                )}
                {activeTab === 'payment' && (
                    <PaymentForm register={register} errors={errors} />
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
                .tabs-container {
                    overflow-x: auto;
                }
                .tabs {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    width: max-content;
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