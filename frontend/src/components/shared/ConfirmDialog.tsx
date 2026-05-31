import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Button } from './Button';
import { TOKENS } from '../../constants/tokens';

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
          borderRadius: TOKENS.borderRadius.large,
          p: 1,
          maxWidth: 440,
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
        <WarningAmberRoundedIcon color="warning" />
        {title}
      </DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        <DialogContentText id="confirm-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif' }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
