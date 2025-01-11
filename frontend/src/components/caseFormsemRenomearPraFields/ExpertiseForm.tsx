import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { TextField, Box } from '@mui/material';

const ExpertiseParticipants: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Box className="form-group">
            <TextField
                label="Participants"
                placeholder="Enter participants details..."
                {...register('expertise.participants')}
                multiline
                rows={15}
                fullWidth
                error={!!errors.expertise?.participants}
                helperText={errors.expertise?.participants?.message}
            />
        </Box>
    );
};

const ExpertiseProcedure: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Box className="form-group">
            <TextField
                label="Procedure"
                placeholder="Enter procedure details..."
                {...register('expertise.procedure')}
                multiline
                rows={15}
                fullWidth
                error={!!errors.expertise?.procedure}
                helperText={errors.expertise?.procedure?.message}
            />
        </Box>
    );
};

const ExpertiseParameters: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Box className="form-group">
            <TextField
                label="Parameters"
                placeholder="Enter parameters details..."
                {...register('expertise.parameters')}
                multiline
                rows={15}
                fullWidth
                error={!!errors.expertise?.parameters}
                helperText={errors.expertise?.parameters?.message}
            />
        </Box>
    );
};

const ExpertiseAnalysis: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Box className="form-group">
            <TextField
                label="Analysis"
                placeholder="Enter analysis details..."
                {...register('expertise.analysis')}
                multiline
                rows={15}
                fullWidth
                error={!!errors.expertise?.analysis}
                helperText={errors.expertise?.analysis?.message}
            />
        </Box>
    );
};

const ExpertiseBriefConclusion: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Box className="form-group">
            <TextField
                label="Brief Conclusion"
                placeholder="Enter brief conclusion..."
                {...register('expertise.briefConclusion')}
                multiline
                rows={15}
                fullWidth
                error={!!errors.expertise?.briefConclusion}
                helperText={errors.expertise?.briefConclusion?.message}
            />
        </Box>
    );
};

export { ExpertiseParticipants, ExpertiseProcedure, ExpertiseParameters, ExpertiseAnalysis, ExpertiseBriefConclusion };