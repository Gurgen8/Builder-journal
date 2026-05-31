import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { TOKENS } from '@/constants/tokens';

export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'classes'>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  hasShadow?: boolean;
  color?: MuiButtonProps['color'];
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  hasShadow = false,
  disabled,
  sx,
  ...props
}) => {
  const shadowStyles = hasShadow
    ? {
        boxShadow: TOKENS.shadows.button,
        '&:hover': {
          boxShadow: TOKENS.shadows.buttonHover,
        },
      }
    : {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      };

  return (
    <MuiButton
      disabled={disabled || isLoading}
      sx={{
        py: 1.25,
        px: 3,
        borderRadius: TOKENS.borderRadius.small,
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        ...shadowStyles,
        ...sx,
      }}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {children}
    </MuiButton>
  );
};
