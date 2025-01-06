import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';

interface SchedulingFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({ register, errors }) => (
    <>
        <div className="form-group">
            <label>Data Sugerida pela IA</label>
            <input
                type="date"
                {...register('scheduling.suggestedExpertiseDateAI')}
            />
        </div>
        <div className="form-group">
            <label>Data Sugerida pelo Perito</label>
            <input
                type="date"
                {...register('scheduling.suggestedExpertiseDateExpert')}
            />
        </div>
        <div className="form-group">
            <label>Contatos Realizados</label>
            <input
                type="checkbox"
                {...register('scheduling.contactsPerformed')}
            />
        </div>
        <div className="form-group">
            <label>Data Confirmada pelo Reclamante</label>
            <input
                type="checkbox"
                {...register('scheduling.expertiseDateConfirmedByPlaintiff')}
            />
        </div>
        <div className="form-group">
            <label>Data Confirmada pelo Réu</label>
            <input
                type="checkbox"
                {...register('scheduling.expertiseDateConfirmedByDefendant')}
            />
        </div>
        <div className="form-group">
            <label>Data Definitiva da Perícia</label>
            <input
                type="date"
                {...register('scheduling.finalExpertiseDate')}
            />
        </div>
    </>
);

export default SchedulingForm;