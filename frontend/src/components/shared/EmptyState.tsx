import React from 'react';
import { Box, Typography } from '@mui/material';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Данные не найдены',
  description = 'В системе пока нет записей, соответствующих выбранным критериям.',
  icon,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        py: 8,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon || <HourglassEmptyRoundedIcon sx={{ fontSize: 44 }} />}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 1,
          fontFamily: 'Outfit, sans-serif',
          color: 'text.primary'
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: 360,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
