import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';
import { TOKENS } from '@/constants/tokens';

export interface TextProps extends MuiTypographyProps {
  fontFamilyType?: 'outfit' | 'inter';
}

export const Text: React.FC<TextProps> = ({
  children,
  fontFamilyType,
  sx,
  variant = 'body2',
  ...props
}) => {
  const isHeading =
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1'].includes(variant) ||
    fontFamilyType === 'outfit';

  return (
    <MuiTypography
      variant={variant}
      sx={{
        fontFamily: isHeading ? 'Outfit, sans-serif' : 'Inter, sans-serif',
        color: isHeading ? TOKENS.colors.textPrimary : TOKENS.colors.textSecondary,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};
