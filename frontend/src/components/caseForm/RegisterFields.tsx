import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { TextField, Box } from '@mui/material';

function RegisterFields() {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <>
            <Box mb={2}>
                <TextField
                    label="Autor"
                    {...register('register.plaintiff', { required: 'Autor é obrigatório' })}
                    error={!!errors.register?.plaintiff}
                    helperText={errors.register?.plaintiff?.message}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Réu"
                    {...register('register.defendant', { required: 'Réu é obrigatório' })}
                    error={!!errors.register?.defendant}
                    helperText={errors.register?.defendant?.message}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Identificador Perícia"
                    {...register('register.expertiseIdentifier')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Processo"
                    {...register('register.caseNumber', { required: 'Processo é obrigatório' })}
                    error={!!errors.register?.caseNumber}
                    helperText={errors.register?.caseNumber?.message}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Data Audiência"
                    type="date"
                    {...register('register.hearingDate')}
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
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Email Adv. Autor"
                    type="email"
                    {...register('register.plaintiffLawyerEmail')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <label>
                    <input
                        type="checkbox"
                        {...register('register.acceptedPerformed')}
                    />
                    Aceita?
                </label>
            </Box>
            <Box mb={2}>
                <TextField
                    label="Objeto"
                    {...register('register.expertiseSubject')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="URL do Processo PDF"
                    type="url"
                    {...register('register.casePdfUrl')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
        </>
    );
}

export default RegisterFields;