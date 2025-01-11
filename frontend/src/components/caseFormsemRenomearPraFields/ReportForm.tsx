import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { TextField, Grid } from '@mui/material';

interface ReportFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const ReportForm: React.FC<ReportFormProps> = ({ register, errors }) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField
                label="URL do Laudo"
                type="url"
                fullWidth
                {...register('expertiseReport.expertiseReportUrl')}
                error={!!errors.expertiseReport?.expertiseReportUrl}
                helperText={errors.expertiseReport?.expertiseReportUrl?.message}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Data de Envio do Laudo"
                type="date"
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                {...register('expertiseReport.expertiseReportSentAt')}
                error={!!errors.expertiseReport?.expertiseReportSentAt}
                helperText={errors.expertiseReport?.expertiseReportSentAt?.message}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Progresso do Laudo"
                type="number"
                fullWidth
                {...register('expertiseReport.expertiseReportProgress')}
                error={!!errors.expertiseReport?.expertiseReportProgress}
                helperText={errors.expertiseReport?.expertiseReportProgress?.message}
            />
        </Grid>
    </Grid>
);

export default ReportForm;