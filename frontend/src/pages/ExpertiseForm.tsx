import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Container, Tabs as MuiTabs, Tab as MuiTab, Box, TextField } from '@mui/material';
import { ICase, CaseSchema } from '../models/ICase';
import { zodResolver } from '@hookform/resolvers/zod';

const defaultValues = CaseSchema.parse({
    expertise: {}
});

const ExpertisePage: React.FC = () => {
    const methods = useForm<ICase>({
        resolver: zodResolver(CaseSchema),
        defaultValues
    });

    const { register, formState: { errors } } = methods;
    const [activeTab, setActiveTab] = React.useState('participants');

    return (
        <FormProvider {...methods}>
            <Container>
                <MuiTabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
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
            </Container>
        </FormProvider>
    );
};

export default ExpertisePage;