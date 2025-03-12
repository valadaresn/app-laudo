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
                    {...register('expertiseReportUrl')}
                    error={!!errors.expertiseReportUrl}
                    helperText={errors.expertiseReportUrl?.message}
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
                    {...register('expertiseReportSentAt')}
                    error={!!errors.expertiseReportSentAt}
                    helperText={errors.expertiseReportSentAt?.message}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Progresso do Relatório"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                    {...register('expertiseReportProgress')}
                    error={!!errors.expertiseReportProgress}
                    helperText={errors.expertiseReportProgress?.message || "Porcentagem de conclusão (0-100)"}
                />
            </Grid>
        </Grid>
    );
}

export default ReportFields;