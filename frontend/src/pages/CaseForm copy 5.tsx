import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICase, CaseSchema } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import Tabs from '../components/caseForm/Tabs';
import FormHeader from '../components/caseForm/FormHeader';
import TabContent from '../components/caseForm/TabContent';
import { Container } from '@mui/material';

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
        reset(currentValues);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <FormProvider {...methods}>
            <Container style={{ height: '80vh' }}>
                <FormHeader isDirty={isDirty} handleSave={handleSave} card={card} />
                <Tabs
                    cardStatus={card?.status}                    
                    finalExpertiseDate={finalExpertiseDate}
                    briefConclusion={briefConclusion}
                    expertiseReportUrl={expertiseReportUrl}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <form onSubmit={handleSubmit(handleSave)}>
                    <TabContent
                        activeTab={activeTab}
                        register={register}
                        errors={errors}
                        isEditing={isEditing}
                        handleEdit={handleEdit}
                        handleCancel={handleCancel}
                    />
                </form>
                <style>{`
                    .form-container {
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        background-color: #f4f4f4;
                        max-width: 800px;
                        margin: 20px auto;
                    }
                `}</style>
            </Container>
        </FormProvider>
    );
};

export default CaseForm;