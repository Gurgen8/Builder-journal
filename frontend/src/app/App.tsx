import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastProvider } from '../components/shared/ToastProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { PageLayout } from '../components/shared/page-layout';
import { WorkLogsScreen } from '../screens/work-logs-screen';
import { WorkTypesScreen } from '../screens/work-types-screen';
import { corporateTheme } from '../theme/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
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
                  <Route path="/" element={<WorkLogsScreen />} />
                  <Route path="/work-types" element={<WorkTypesScreen />} />
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
