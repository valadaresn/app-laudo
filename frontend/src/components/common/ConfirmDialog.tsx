import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ open, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmação</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você tem alterações não salvas. Deseja salvar antes de sair?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Não
        </Button>
        <Button
          onClick={async () => {
            await onConfirm();
            onClose();
          }}
          color="primary"
        >
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  );
}