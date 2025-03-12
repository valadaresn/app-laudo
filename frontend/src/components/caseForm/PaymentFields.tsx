import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';

function PaymentFields() {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        {...register('isPaid')}
                    />
                }
                label="Recebido"
            />
            <div className="form-group">
                <TextField
                    label="Valor Honorário"
                    type="number"
                    {...register('feeAmount')}
                    error={!!errors.feeAmount}
                    helperText={errors.feeAmount?.message}
                    fullWidth
                />
            </div>
        </>
    );
}

export default PaymentFields;