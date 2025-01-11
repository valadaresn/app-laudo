import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

interface PaymentFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ register, errors }) => (
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

export default PaymentForm;