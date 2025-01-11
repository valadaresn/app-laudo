import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { TextField, Button, Box } from '@mui/material';

interface RegisterFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
    isEditing: boolean;
    handleEdit: () => void;
    handleCancel: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ register, errors, isEditing, handleEdit, handleCancel }) => (
    <>
        <Box mb={2}>
            <TextField
                label="Autor"
                {...register('register.plaintiff', { required: 'Autor é obrigatório' })}
                error={!!errors.register?.plaintiff}
                helperText={errors.register?.plaintiff?.message}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Réu"
                {...register('register.defendant', { required: 'Réu é obrigatório' })}
                error={!!errors.register?.defendant}
                helperText={errors.register?.defendant?.message}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Identificador Perícia"
                {...register('register.expertiseIdentifier')}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Processo"
                {...register('register.caseNumber', { required: 'Processo é obrigatório' })}
                error={!!errors.register?.caseNumber}
                helperText={errors.register?.caseNumber?.message}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Data Audiência"
                type="date"
                {...register('register.hearingDate')}
                disabled={!isEditing}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Email Adv. Réu"
                type="email"
                {...register('register.defendantLawyerEmail')}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="Email Adv. Autor"
                type="email"
                {...register('register.plaintiffLawyerEmail')}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <label>
                <input
                    type="checkbox"
                    {...register('register.acceptedPerformed')}
                    disabled={!isEditing}
                />
                Aceita?
            </label>
        </Box>
        <Box mb={2}>
            <TextField
                label="Objeto"
                {...register('register.expertiseSubject')}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        <Box mb={2}>
            <TextField
                label="URL do Processo PDF"
                type="url"
                {...register('register.casePdfUrl')}
                disabled={!isEditing}
                fullWidth
            />
        </Box>
        {isEditing ? (
            <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
                <Button type="submit" variant="contained">Salvar</Button>
            </Box>
        ) : (
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="outlined" onClick={handleEdit}>Editar</Button>
            </Box>
        )}
    </>
);

export default RegisterForm;