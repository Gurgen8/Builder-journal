import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@mui/material';
import { TOKENS } from '@/constants/tokens';

export interface ModalProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: TOKENS.borderRadius.large,
          p: 1,
          boxShadow: TOKENS.shadows.modal,
        },
      }}
      {...props}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {children}
      </DialogContent>

      {actions ? (
        <DialogActions sx={{ p: 3, gap: 1 }}>
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
};
