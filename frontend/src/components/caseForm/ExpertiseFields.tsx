import { TextField, Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';

function ExpertiseFields() {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Box className="form-group">
            <TextField
                label="Data Perícia"
                type="date"
                {...register('scheduling.finalExpertiseDate')}
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.scheduling?.finalExpertiseDate}
                helperText={errors.scheduling?.finalExpertiseDate?.message}
            />
        </Box>
    );
}

export default ExpertiseFields;