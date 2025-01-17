import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICase, CaseSchema } from '../models/ICase';
import { db } from '../firebaseConfig';
import { doc, updateDoc, addDoc, collection, onSnapshot } from 'firebase/firestore';
import Tabs from '../components/caseForm/Tabs';
import FormHeader from '../components/caseForm/FormHeader';
import RegisterFields from '../components/caseForm/RegisterFields';
import SchedulingFields from '../components/caseForm/SchedulingFields';
import ExpertiseFields from '../components/caseForm/ExpertiseFields';
import PaymentFields from '../components/caseForm/PaymentFields';
import ReportFields from '../components/caseForm/ReportFields';
import { Container } from '@mui/material';

const defaultValues = CaseSchema.parse({
    register: {},
    scheduling: {},
    expertiseReport: {},
    payment: {},
    expertise: {}
});

function CaseForm({ cardId, onClose, initialTab }: { cardId: string | null; onClose: () => void; initialTab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' }) {
    const methods = useForm<ICase>({
        resolver: zodResolver(CaseSchema),
        defaultValues
    });
    
    const { handleSubmit, reset, watch, formState: { isDirty }, getValues } = methods;
    
    const [activeTab, setActiveTab] = useState<'register' | 'scheduling' | 'report' | 'payment' | 'expertise'>(initialTab);
    const initialValuesRef = useRef<ICase | null>(null);

    const finalExpertiseDate = watch('scheduling.finalExpertiseDate');
    const briefConclusion = watch('expertise.briefConclusion');
    const expertiseReportUrl = watch('expertiseReport.expertiseReportUrl');

    useEffect(() => {
        if (cardId && typeof cardId === 'string') {
            const docRef = doc(db, 'cases', cardId);
            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
                    const cardData = snapshot.data() as ICase;
                    console.log('Fetched card data:', cardData); // Log dos dados puxados
                    reset(cardData);
                    initialValuesRef.current = cardData;
                } else {
                    console.log('No such document!');
                    reset(defaultValues);
                    initialValuesRef.current = defaultValues;
                }
            });
            return () => unsubscribe();
        } else {
            console.log('Invalid cardId or no cardId provided');
            reset(defaultValues);
            initialValuesRef.current = defaultValues;
        }
        setActiveTab(initialTab);
    }, [cardId, initialTab, reset]);

    const handleSave = async () => {
        const currentValues = getValues();
        console.log('Saving current values:', currentValues); // Log dos valores atuais
        if (cardId && typeof cardId === 'string') {
            const docRef = doc(db, 'cases', cardId);
            await updateDoc(docRef, currentValues);
        } else {
            await addDoc(collection(db, 'cases'), currentValues);
        }
        reset(currentValues); 
    };

    return (
        <FormProvider {...methods}>
            <Container style={{ height: '80vh' }}>
                <FormHeader isDirty={isDirty} handleSave={handleSave} cardId={cardId} />
                <Tabs
                    cardStatus={initialValuesRef.current?.status}                    
                    finalExpertiseDate={finalExpertiseDate}
                    briefConclusion={briefConclusion}
                    expertiseReportUrl={expertiseReportUrl}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <form onSubmit={handleSubmit(handleSave)}>
                    {activeTab === 'register' && (
                        <RegisterFields />
                    )}
                    {activeTab === 'scheduling' && (
                        <SchedulingFields />
                    )}
                    {activeTab === 'expertise' && (
                        <ExpertiseFields />
                    )}
                    {activeTab === 'report' && (
                        <ReportFields />
                    )}
                    {activeTab === 'payment' && (
                        <PaymentFields />
                    )}
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
}

export default CaseForm;