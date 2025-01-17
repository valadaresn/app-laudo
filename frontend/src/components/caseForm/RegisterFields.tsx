import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { StatusEnum, statusLabels } from '../../models/Status';

const RegisterFields: React.FC = () => {
    const { register, formState: { errors }, getValues } = useFormContext<ICase>();
    const status = getValues('status'); // Obter o valor inicial do campo 'status'

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
                    label="Número do Caso"
                    {...register('register.caseNumber')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Data da Audiência"
                    type="date"
                    {...register('register.hearingDate')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: { max: new Date().toISOString().split('T')[0] }
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
                    {...register('register.casePdfUrl')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    select
                    label="Status"
                    {...register('status')}
                    defaultValue={status} // Definir o valor inicial do campo 'status'
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    {StatusEnum.map((status) => (
                        <MenuItem key={status} value={status}>
                            {statusLabels[status]}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        </>
    );
};

export default RegisterFields;