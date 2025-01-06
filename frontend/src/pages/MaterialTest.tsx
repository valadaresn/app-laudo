import React from 'react';
import Button from '@mui/material/Button';

const MaterialTest: React.FC = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Button variant="contained" color="primary">
                Test Material-UI Button
            </Button>
        </div>
    );
};

export default MaterialTest;