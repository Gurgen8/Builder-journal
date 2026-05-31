import { createTheme } from '@mui/material/styles';
import { TOKENS } from '@/constants/tokens';

export const corporateTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: TOKENS.colors.primary,
      light: TOKENS.colors.primaryLight,
      dark: TOKENS.colors.primaryDark,
      contrastText: TOKENS.colors.contrastText,
    },
    secondary: {
      main: TOKENS.colors.secondary,
      light: TOKENS.colors.secondaryLight,
      dark: TOKENS.colors.secondaryDark,
      contrastText: TOKENS.colors.contrastText,
    },
    error: {
      main: TOKENS.colors.error.main,
      light: TOKENS.colors.error.light,
      dark: TOKENS.colors.error.dark,
      contrastText: TOKENS.colors.contrastText,
    },
    success: {
      main: TOKENS.colors.success.main,
      light: TOKENS.colors.success.light,
      dark: TOKENS.colors.success.dark,
      contrastText: TOKENS.colors.contrastText,
    },
    background: {
      default: TOKENS.colors.bgDefault,
      paper: TOKENS.colors.bgPaper,
    },
    text: {
      primary: TOKENS.colors.textPrimary,
      secondary: TOKENS.colors.textSecondary,
    },
    divider: TOKENS.colors.divider,
    action: {
      hover: TOKENS.colors.actionHover,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'Outfit, sans-serif' },
    h2: { fontFamily: 'Outfit, sans-serif' },
    h3: { fontFamily: 'Outfit, sans-serif' },
    h4: { fontFamily: 'Outfit, sans-serif' },
    h5: { fontFamily: 'Outfit, sans-serif', fontWeight: 700 },
    h6: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
    subtitle1: { fontFamily: 'Outfit, sans-serif' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8 * TOKENS.borderRadius.small,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8 * TOKENS.borderRadius.small,
          padding: '8px 16px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});
