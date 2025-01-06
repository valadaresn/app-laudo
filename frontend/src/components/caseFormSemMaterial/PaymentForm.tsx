import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';

interface PaymentFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ register, errors }) => (
    <>
        <div className="form-group">
            <label>Recebido</label>
            <input
                type="checkbox"
                {...register('payment.isPaid')}
            />
        </div>
        <div className="form-group">
            <label>Valor Honorário</label>
            <input
                type="number"
                {...register('payment.feeAmount')}
            />
        </div>
    </>
);

export default PaymentForm;