import React from 'react';
import { TextField, Box } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';

interface ExpertiseFieldsProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const ExpertiseFields: React.FC<ExpertiseFieldsProps> = ({ register, errors }) => (
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

export default ExpertiseFields;