import React from 'react';
import { Box, Typography } from '@mui/material';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { TOKENS } from '@/constants/tokens';

interface LoaderProps {
  message?: string;
  height?: string | number;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Загрузка данных...',
  height = '100%',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        py: 8,
      }}
    >
      <Box
        sx={{
          animation: TOKENS.animations.spin,
          color: 'primary.main',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ConstructionRoundedIcon sx={{ fontSize: 48 }} />
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {message}
      </Typography>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};
