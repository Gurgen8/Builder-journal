import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 1,
          maxWidth: 440,
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
        <WarningAmberRoundedIcon color="warning" />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={isLoading} sx={{ borderRadius: 2 }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: 'error.dark',
            },
          }}
        >
          {isLoading ? 'Удаление...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
