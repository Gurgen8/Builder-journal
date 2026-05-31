import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import { TOKENS } from '@/constants/tokens';

export interface CardProps extends PaperProps {
  hoverable?: boolean;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  border = true,
  sx,
  ...props
}) => {
  const hoverStyles = hoverable
    ? {
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'primary.main',
          boxShadow: TOKENS.shadows.cardHover,
        },
      }
    : {};

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: TOKENS.borderRadius.card,
        border: border ? '1px solid' : 'none',
        borderColor: TOKENS.colors.divider,
        bgcolor: TOKENS.colors.bgPaper,
        boxShadow: TOKENS.shadows.card,
        ...hoverStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};
