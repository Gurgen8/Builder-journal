import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastProvider } from '../shared/ui/toast-provider';
import { ErrorBoundary } from '../shared/ui/error-boundary';
import { PageLayout } from '../shared/ui/page-layout';
import { WorkLogsPage } from '../pages/work-logs-page';
import { WorkTypesPage } from '../pages/work-types-page';

// 1. Configure TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  },
});

// 2. Define High-End Corporate HSL Teal Theme
const corporateTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006666', // Deep corporate Teal
      light: '#e0f2f1', // Ultra light teal for active buttons/backgrounds
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569', // Professional Slate
      light: '#64748b',
      dark: '#334155',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef5350', // Soft corporate red
      light: '#ffebee', // Pastel light red (MUI red[50])
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Very soft grey-blue background
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900 for modern high contrast reading
      secondary: '#475569', // Slate 600
    },
    divider: '#e2e8f0', // Clean Slate divider
    action: {
      hover: '#f1f5f9', // Slate 100
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
    borderRadius: 8, // Sleek modern roundings
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={corporateTheme}>
          <CssBaseline />
          <ToastProvider>
            <BrowserRouter>
              <PageLayout>
                <Routes>
                  <Route path="/" element={<WorkLogsPage />} />
                  <Route path="/work-types" element={<WorkTypesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageLayout>
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
