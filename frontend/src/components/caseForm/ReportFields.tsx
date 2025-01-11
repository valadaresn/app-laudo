import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';

function ReportFields() {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
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
        </Grid>
    );
}

export default ReportFields;