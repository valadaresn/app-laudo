import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { TextField, FormControlLabel, Switch, Box } from '@mui/material';

interface SchedulingFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({ register, errors }) => (
    <>
        <Box mb={2}>
            <TextField
                label="Data Sugerida pela IA"
                type="date"
                {...register('scheduling.suggestedExpertiseDateAI')}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.scheduling?.suggestedExpertiseDateAI}
                helperText={errors.scheduling?.suggestedExpertiseDateAI?.message}
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Data Sugerida pelo Perito"
                type="date"
                {...register('scheduling.suggestedExpertiseDateExpert')}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.scheduling?.suggestedExpertiseDateExpert}
                helperText={errors.scheduling?.suggestedExpertiseDateExpert?.message}
            />
        </Box>
        <Box mb={2}>
            <FormControlLabel
                control={
                    <Switch
                        {...register('scheduling.contactsPerformed')}
                    />
                }
                label="Contatos Realizados"
            />
        </Box>
        <Box mb={2}>
            <FormControlLabel
                control={
                    <Switch
                        {...register('scheduling.expertiseDateConfirmedByPlaintiff')}
                    />
                }
                label="Data Confirmada pelo Reclamante"
            />
        </Box>
        <Box mb={2}>
            <FormControlLabel
                control={
                    <Switch
                        {...register('scheduling.expertiseDateConfirmedByDefendant')}
                    />
                }
                label="Data Confirmada pelo Réu"
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Data Definitiva da Perícia"
                type="date"
                {...register('scheduling.finalExpertiseDate')}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.scheduling?.finalExpertiseDate}
                helperText={errors.scheduling?.finalExpertiseDate?.message}
            />
        </Box>
    </>
);

export default SchedulingForm;