import React from 'react';

interface FormHeaderProps {
    isDirty: boolean;
    handleSave: () => Promise<void>;
    cardId: string | null;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isDirty, handleSave, cardId }) => {
    return (
        <div className="form-header">
            <h2>{cardId ? 'Edit Case' : 'New Case'}</h2>
            <button onClick={handleSave} disabled={!isDirty}>
                Save
            </button>
        </div>
    );
};

export default FormHeader;