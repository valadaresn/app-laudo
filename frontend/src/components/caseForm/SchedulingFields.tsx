import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { TextField, FormControlLabel, Switch, Box } from '@mui/material';

function SchedulingFields() {
    const { register, formState: { errors }, watch } = useFormContext<ICase>();

    // Obter os valores dos campos booleanos
    const contactsPerformed = watch('contactsPerformed');
    const schedulingPetitionSent = watch('schedulingPetitionSent');

    return (
        <>
            <Box mb={2}>
                <TextField
                    label="Data Sugerida pela IA"
                    type="date"
                    {...register('suggestedExpertiseDateAI')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={!!errors.suggestedExpertiseDateAI}
                    helperText={errors.suggestedExpertiseDateAI?.message}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Data Sugerida pelo Perito"
                    type="date"
                    {...register('suggestedExpertiseDateExpert')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={!!errors.suggestedExpertiseDateExpert}
                    helperText={errors.suggestedExpertiseDateExpert?.message}
                />
            </Box>
            <Box mb={2}>
                <FormControlLabel
                    control={
                        <Switch
                            {...register('contactsPerformed')}
                            checked={contactsPerformed}
                        />
                    }
                    label="Contatos Realizados"
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Data Definitiva da Perícia"
                    type="date"
                    {...register('finalExpertiseDate')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={!!errors.finalExpertiseDate}
                    helperText={errors.finalExpertiseDate?.message}
                />
            </Box>
            <Box mb={2}>
                <FormControlLabel
                    control={
                        <Switch
                            {...register('schedulingPetitionSent')}
                            checked={schedulingPetitionSent}
                        />
                    }
                    label="Petição de Agendamento Enviada"
                />
            </Box>
        </>
    );
}

export default SchedulingFields;