import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { Container, Tabs as MuiTabs, Tab as MuiTab, Box, TextField, Button } from '@mui/material';
import { IExpertise, ExpertiseSchema, ICase } from '../models/ICase';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

const defaultValues = ExpertiseSchema.parse({});

interface ExpertiseFormProps {
    expertiseId?: string;
    onClose: () => void;
}

function ExpertiseForm({ expertiseId: initialExpertiseId, onClose }: ExpertiseFormProps) {
    const methods = useForm<IExpertise>({
        resolver: zodResolver(ExpertiseSchema),
        defaultValues
    });

    const { register, handleSubmit, formState: { errors }, reset } = methods;
    const { getValues } = useFormContext<ICase>();
    const [activeTab, setActiveTab] = useState('dados');
    const [expertiseId, setExpertiseId] = useState(initialExpertiseId);

    useEffect(() => {
        if (expertiseId) {
            const loadExpertise = async () => {
                const docRef = doc(db, 'expertises', expertiseId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    reset(docSnap.data() as IExpertise);
                }
            };
            loadExpertise();
        } else {
            const caseData = getValues();
            reset({
                plaintiff: caseData.register.plaintiff,
                defendant: caseData.register.defendant,
                caseId: caseData.id,
                dateTime: caseData.scheduling.finalExpertiseDate
            });
        }
    }, [expertiseId, reset, getValues]);

    const onSubmit = async (data: IExpertise) => {
        try {
            if (expertiseId) {
                await setDoc(doc(db, 'expertises', expertiseId), data);
            } else {
                const docRef = await addDoc(collection(db, 'expertises'), data);
                setExpertiseId(docRef.id);
            }
            console.log('Expertise saved successfully');
        } catch (e) {
            console.error('Error saving expertise:', e);
        }
    };

    return (
        <FormProvider {...methods}>
            <Container>
                <MuiTabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <MuiTab label="Dados" value="dados" />
                    <MuiTab label="Participantes" value="participants" />
                    <MuiTab label="Procedimento" value="procedure" />
                    <MuiTab label="Parâmetro" value="parameters" />
                    <MuiTab label="Conclusão" value="briefConclusion" />
                </MuiTabs>
                <Box mt={2} className="form-group">
                    {activeTab === 'dados' && (
                        <>
                            <Box mb={2}>
                                <TextField
                                    label="Autor"
                                    placeholder="Enter plaintiff details..."
                                    {...register('plaintiff')}
                                    fullWidth
                                    error={!!errors.plaintiff}
                                    helperText={errors.plaintiff?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Réu"
                                    placeholder="Enter defendant details..."
                                    {...register('defendant')}
                                    fullWidth
                                    error={!!errors.defendant}
                                    helperText={errors.defendant?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Data e Hora da Perícia"
                                    type="datetime-local"
                                    {...register('dateTime')}
                                    fullWidth
                                    error={!!errors.dateTime}
                                    helperText={errors.dateTime?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Case ID"
                                    placeholder="Enter case ID..."
                                    {...register('caseId')}
                                    fullWidth
                                    disabled
                                    error={!!errors.caseId}
                                    helperText={errors.caseId?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Local Perícia"
                                    placeholder="Enter expertise location..."
                                    {...register('location')}
                                    fullWidth
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                        </>
                    )}
                    {activeTab === 'participants' && (
                        <TextField
                            label="Participantes"
                            placeholder="Enter participants details..."
                            {...register('participants')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.participants}
                            helperText={errors.participants?.message}
                        />
                    )}
                    {activeTab === 'procedure' && (
                        <TextField
                            label="Procedimento"
                            placeholder="Enter procedure details..."
                            {...register('procedure')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.procedure}
                            helperText={errors.procedure?.message}
                        />
                    )}
                    {activeTab === 'parameters' && (
                        <TextField
                            label="Parâmetros"
                            placeholder="Enter parameters details..."
                            {...register('parameters')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.parameters}
                            helperText={errors.parameters?.message}
                        />
                    )}
                    {activeTab === 'briefConclusion' && (
                        <TextField
                            label="Conclusão"
                            placeholder="Enter brief conclusion..."
                            {...register('briefConclusion')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.briefConclusion}
                            helperText={errors.briefConclusion?.message}
                        />
                    )}
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                        Salvar Perícia
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Fechar
                    </Button>
                </Box>
            </Container>
            <style>{`
                .MuiTab-root {
                    text-transform: none;
                }
            `}</style>
        </FormProvider>
    );
}

export default ExpertiseForm;