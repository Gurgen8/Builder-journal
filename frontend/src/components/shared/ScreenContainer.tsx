import React from 'react';
import { Box } from '@mui/material';

interface ScreenContainerProps {
  children: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
};
