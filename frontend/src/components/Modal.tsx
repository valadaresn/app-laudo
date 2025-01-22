import React from 'react';
import { Modal as MuiModal, Box } from '@mui/material';

interface ModalProps {
    open: boolean;
    onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
    return (
        <MuiModal
            open={open}
            onClose={(event, reason) => {
                if (reason === 'backdropClick') return;
                onClose(event, reason);
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box className="modal-box">
                {children}
            </Box>
        </MuiModal>
    );
};

export default Modal;

<style>{`
    .modal-box {
        width: 85%;
        height: 100vh; /* Ajusta a altura para ocupar toda a tela */
        background-color: #fff;
        
        box-shadow: 24px;
        padding: 16px;
        overflow: auto;
        max-width: 700px;
        border: 1px solid #ccc;
        transition: visibility 0s, opacity 0.5s linear;
    }
`}</style>