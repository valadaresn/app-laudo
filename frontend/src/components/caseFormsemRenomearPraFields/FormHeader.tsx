import React from 'react';
import { Button } from '@mui/material';

interface FormHeaderProps {
    isDirty: boolean;
    handleSave: () => void;
    card: any;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isDirty, handleSave, card }) => {
    return (
        <div className="form-header">
            <h2>{card ? 'Editar Caso' : 'Novo Caso'}</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!isDirty}
            >
                Salvar
            </Button>
            <style>{`
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            `}</style>
        </div>
    );
};

export default FormHeader;