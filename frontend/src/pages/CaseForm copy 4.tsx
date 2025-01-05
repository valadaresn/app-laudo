import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICase, CaseSchema } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import RegisterForm from '../components/caseForm/RegisterForm';
import SchedulingForm from '../components/caseForm/SchedulingForm';
import ReportForm from '../components/caseForm/ReportForm';
import PaymentForm from '../components/caseForm/PaymentForm';
import { ExpertiseParticipants, ExpertiseProcedure, ExpertiseParameters, ExpertiseAnalysis, ExpertiseBriefConclusion } from '../components/caseForm/ExpertiseForm';
import Tabs from '../components/caseForm/Tabs';

const defaultValues = CaseSchema.parse({
    register: {},
    scheduling: {},
    expertiseReport: {},
    payment: {},
    expertise: {}
});

const CaseForm: React.FC<{ card: ICase | null; onClose: () => void; initialTab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' }> = ({ card, onClose, initialTab }) => {
    const methods = useForm<ICase>({
        resolver: zodResolver(CaseSchema),
        defaultValues
    });
    
    const { register, handleSubmit, reset, watch, formState: { errors, isDirty }, getValues } = methods;
    
    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion'>(initialTab);
    const [isEditing, setIsEditing] = useState(false);
    const initialValuesRef = useRef<ICase | null>(null);

    const finalExpertiseDate = watch('scheduling.finalExpertiseDate');
    const briefConclusion = watch('expertise.briefConclusion');
    const expertiseReportUrl = watch('expertiseReport.expertiseReportUrl');

    useEffect(() => {
        if (card) {
            reset(card);
            initialValuesRef.current = card;
        } else {
            reset(defaultValues);
            initialValuesRef.current = defaultValues;
        }
        setActiveTab(initialTab);
    }, [card, initialTab, reset]);

    const handleSave = async () => {
        const currentValues = getValues();
        if (card?.id) {
            const docRef = doc(db, 'cases', card.id);
            await updateDoc(docRef, currentValues);
        } else {
            await addDoc(collection(db, 'cases'), currentValues);
        }
        // Após salvar, pode limpar o estado de "dirty"
        reset(currentValues);
        onClose();
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <FormProvider {...methods}>
            <div className="form-container">
                <div className="form-header">
                    <h2>{card ? 'Editar Caso' : 'Novo Caso'}</h2>
                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={!isDirty}
                    >
                        Salvar
                    </button>
                </div>
                <Tabs
                    cardStatus={card?.status}
                    finalExpertiseDate={finalExpertiseDate}
                    briefConclusion={briefConclusion}
                    expertiseReportUrl={expertiseReportUrl}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <form onSubmit={handleSubmit(handleSave)}>
                    {activeTab === 'register' && (
                        <RegisterForm
                            register={register}
                            errors={errors}
                            isEditing={isEditing}
                            handleEdit={handleEdit}
                            handleCancel={handleCancel}
                        />
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
                        <ExpertiseParticipants />
                    )}
                    {activeTab === 'procedure' && (
                        <ExpertiseProcedure />
                    )}
                    {activeTab === 'parameters' && (
                        <ExpertiseParameters />
                    )}
                    {activeTab === 'analysis' && (
                        <ExpertiseAnalysis />
                    )}
                    {activeTab === 'briefConclusion' && (
                        <ExpertiseBriefConclusion />
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
                    .form-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .save-button {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        background-color: #007bff;
                        color: white;
                        cursor: pointer;
                    }
                    .save-button:disabled {
                        background-color: #ccc;
                        cursor: not-allowed;
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
                    .expertise-content {
                        margin-top: 20px;
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
        </FormProvider>
    );
};

export default CaseForm;