/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const showSuccess = useCallback((msg: string) => {
    setMessage(msg);
    setSeverity('success');
    setOpen(true);
  }, []);

  const showError = useCallback((msg: string) => {
    setMessage(msg);
    setSeverity('error');
    setOpen(true);
  }, []);

  const showWarning = useCallback((msg: string) => {
    setMessage(msg);
    setSeverity('warning');
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity} 
          variant="filled" 
          sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
