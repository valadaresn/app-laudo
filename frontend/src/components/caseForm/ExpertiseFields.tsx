import { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import ExpertiseForm from '../../pages/ExpertiseForm';
import Modal from '../Modal';


function ExpertiseFields() {
    const { register, formState: { errors } } = useFormContext<ICase>();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <Box className="form-group">
            <TextField
                label="Data Perícia"
                type="date"
                {...register('scheduling.finalExpertiseDate')}
                InputLabelProps={{
                    shrink: true,
                }}
                error={!!errors.scheduling?.finalExpertiseDate}
                helperText={errors.scheduling?.finalExpertiseDate?.message}
            />
            <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginTop: '16px' }}>
                Realizar Perícia
            </Button>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <ExpertiseForm onClose={handleCloseModal} />
            </Modal>
        </Box>
    );
}

export default ExpertiseFields;