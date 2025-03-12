import React, { useEffect } from 'react';
import { Box, TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import { Status, StatusEnum, statusLabels } from '../../models/Status';

const RegisterFields: React.FC = () => {
    const { register, formState: { errors }, setValue, watch } = useFormContext<ICase>();
    const status = watch('status') || 'register'; // Obter o valor inicial do campo 'status'

    useEffect(() => {
        register('status'); // Registrar o campo 'status'
    }, [register]);

    return (
        <>
            <Box mb={2}>
                <TextField
                    label="Autor"
                    {...register('plaintiff', { required: 'Autor é obrigatório' })}
                    error={!!errors.plaintiff}
                    helperText={errors.plaintiff?.message}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Réu"
                    {...register('defendant', { required: 'Réu é obrigatório' })}
                    error={!!errors.defendant}
                    helperText={errors.defendant?.message}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Identificador Perícia"
                    {...register('expertiseIdentifier')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Número do Caso"
                    {...register('caseNumber')}
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
                    {...register('defendantLawyerEmail')}
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
                    {...register('plaintiffLawyerEmail')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <FormControlLabel
                    control={
                        <Checkbox
                            {...register('acceptedPerformed')}
                        />
                    }
                    label="Aceita?"
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="Objeto"
                    {...register('expertiseSubject')}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mb={2}>
                <TextField
                    label="URL do Processo PDF"
                    {...register('casePdfUrl')}
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
                    value={status}
                    onChange={(e) => setValue('status', e.target.value as Status, { 
                        shouldDirty: true  // Esta opção marca o formulário como modificado
                    })}
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