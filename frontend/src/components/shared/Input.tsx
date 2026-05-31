import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { TOKENS } from '@/constants/tokens';

export type InputProps = MuiTextFieldProps;

export const Input: React.FC<InputProps> = ({ sx, ...props }) => {
  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: TOKENS.borderRadius.small,
          transition: 'border-color 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};
