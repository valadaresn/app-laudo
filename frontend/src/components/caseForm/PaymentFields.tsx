import React from 'react';
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
                        {...register('payment.isPaid')}
                    />
                }
                label="Recebido"
            />
            <div className="form-group">
                <TextField
                    label="Valor Honorário"
                    type="number"
                    {...register('payment.feeAmount')}
                    error={!!errors.payment?.feeAmount}
                    helperText={errors.payment?.feeAmount?.message}
                    fullWidth
                />
            </div>
        </>
    );
}

export default PaymentFields;