import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';

interface RegisterFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
    isEditing: boolean;
    handleEdit: () => void;
    handleCancel: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ register, errors, isEditing, handleEdit, handleCancel }) => (
    <>
        <div className="form-group">
            <label>Autor</label>
            <input
                type="text"
                {...register('register.plaintiff', { required: 'Autor é obrigatório' })}
                disabled={!isEditing}
            />
            {errors.register?.plaintiff && <span className="error">{errors.register.plaintiff.message}</span>}
        </div>
        <div className="form-group">
            <label>Réu</label>
            <input
                type="text"
                {...register('register.defendant', { required: 'Réu é obrigatório' })}
                disabled={!isEditing}
            />
            {errors.register?.defendant && <span className="error">{errors.register.defendant.message}</span>}
        </div>
        <div className="form-group">
            <label>Identificador Perícia</label>
            <input
                type="text"
                {...register('register.expertiseIdentifier')}
                disabled={!isEditing}
            />
        </div>
        <div className="form-group">
            <label>Processo</label>
            <input
                type="text"
                {...register('register.caseNumber', { required: 'Processo é obrigatório' })}
                disabled={!isEditing}
            />
            {errors.register?.caseNumber && <span className="error">{errors.register.caseNumber.message}</span>}
        </div>
        <div className="form-group">
            <label>Data Audiência</label>
            <input
                type="date"
                {...register('register.hearingDate')}
                disabled={!isEditing}
            />
        </div>
        <div className="form-group">
            <label>Email Adv. Réu</label>
            <input
                type="email"
                {...register('register.defendantLawyerEmail')}
                disabled={!isEditing}
            />
        </div>
        <div className="form-group">
            <label>Email Adv. Autor</label>
            <input
                type="email"
                {...register('register.plaintiffLawyerEmail')}
                disabled={!isEditing}
            />
        </div>
        <div className="form-group">
            <label>
                <input
                    type="checkbox"
                    {...register('register.acceptedPerformed')}
                    disabled={!isEditing}
                />
                Aceita?
            </label>
        </div>
        <div className="form-group">
            <label>Objeto</label>
            <input
                type="text"
                {...register('register.expertiseSubject')}
                disabled={!isEditing}
            />
        </div>
        <div className="form-group">
            <label>URL do Processo PDF</label>
            <input
                type="url"
                {...register('register.casePdfUrl')}
                disabled={!isEditing}
            />
        </div>
        {isEditing ? (
            <div className="form-actions">
                <button type="button" onClick={handleCancel}>Cancelar</button>
                <button type="submit">Salvar</button>
            </div>
        ) : (
            <div className="form-actions">
                <button type="button" onClick={handleEdit}>Editar</button>
            </div>
        )}
    </>
);

export default RegisterForm;