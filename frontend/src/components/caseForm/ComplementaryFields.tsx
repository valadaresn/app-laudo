import { TextField, Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';

function ComplementaryFields() {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    label="URL do Laudo Complementar"
                    type="url"
                    fullWidth
                    {...register('complementaryReportUrl')}
                    error={!!errors.complementaryReportUrl}
                    helperText={errors.complementaryReportUrl?.message}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Data de Envio do Laudo Complementar"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('complementaryReportSentAt')}
                    error={!!errors.complementaryReportSentAt}
                    helperText={errors.complementaryReportSentAt?.message}
                />
            </Grid>
        </Grid>
    );
}

export default ComplementaryFields;