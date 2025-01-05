import React from 'react';

interface FormHeaderProps {
    isDirty: boolean;
    handleSave: () => void;
    card: any;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isDirty, handleSave, card }) => {
    return (
        <div className="form-header">
            <h2>{card ? 'Editar Caso' : 'Novo Caso'}</h2>
            <button
                className="save-button"
                onClick={handleSave}
                disabled={!isDirty}
            >
                Salvar
            </button>
            <style>{`
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .save-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                }
                .save-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default FormHeader;