import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Container, Tabs as MuiTabs, Tab as MuiTab, Box, TextField, Button } from '@mui/material';
import { ICase, CaseSchema } from '../models/ICase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const defaultValues = CaseSchema.parse({
    register: {},
    scheduling: {},
    expertiseReport: {},
    payment: {},
    expertise: {}
});

interface ExpertiseFormProps {
    onClose: () => void;
}

function ExpertiseForm({ onClose }: ExpertiseFormProps) {
    const { caseId } = useParams<{ caseId: string }>();
    const methods = useForm<ICase>({
        resolver: zodResolver(CaseSchema),
        defaultValues
    });

    const { register, handleSubmit, formState: { errors } } = methods;
    const [activeTab, setActiveTab] = React.useState('participants');

    const onSubmit = async (data: ICase) => {
        const expertiseData = {
            ...data.expertise,
            caseId,
            plaintiff: data.register.plaintiff,
            defendant: data.register.defendant,
            finalExpertiseDate: data.scheduling.finalExpertiseDate
        };

        try {
            await setDoc(doc(db, 'expertises', caseId), expertiseData);
            console.log('Expertise saved successfully');
        } catch (e) {
            console.error('Error saving expertise: ', e);
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
                    <MuiTab label="Participantes" value="participants" />
                    <MuiTab label="Procedimento" value="procedure" />
                    <MuiTab label="Parâmetro" value="parameters" />
                    <MuiTab label="Conclusão" value="briefConclusion" />
                </MuiTabs>
                <Box className="form-group">
                    {activeTab === 'participants' && (
                        <TextField
                            label="Participantes"
                            placeholder="Enter participants details..."
                            {...register('expertise.participants')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.expertise?.participants}
                            helperText={errors.expertise?.participants?.message}
                        />
                    )}
                    {activeTab === 'procedure' && (
                        <TextField
                            label="Procedimento"
                            placeholder="Enter procedure details..."
                            {...register('expertise.procedure')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.expertise?.procedure}
                            helperText={errors.expertise?.procedure?.message}
                        />
                    )}
                    {activeTab === 'parameters' && (
                        <TextField
                            label="Parâmetros"
                            placeholder="Enter parameters details..."
                            {...register('expertise.parameters')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.expertise?.parameters}
                            helperText={errors.expertise?.parameters?.message}
                        />
                    )}
                    {activeTab === 'briefConclusion' && (
                        <TextField
                            label="Conclusão"
                            placeholder="Enter brief conclusion..."
                            {...register('expertise.briefConclusion')}
                            multiline
                            rows={15}
                            fullWidth
                            error={!!errors.expertise?.briefConclusion}
                            helperText={errors.expertise?.briefConclusion?.message}
                        />
                    )}
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                        Salvar Perícia
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                </Box>
            </Container>
        </FormProvider>
    );
}

export default ExpertiseForm;