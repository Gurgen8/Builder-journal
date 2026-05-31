import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ErrorOutlineRoundedIcon color="error" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
              Что-то пошло не так
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Произошла непредвиденная ошибка при отрисовке интерфейса. Пожалуйста, перезапустите приложение или обратитесь к системному администратору.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  textAlign: 'left',
                  mb: 4,
                  overflowX: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', color: 'error.main' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{ borderRadius: 2, px: 4, py: 1, boxShadow: 'none' }}
            >
              Вернуться на главную
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}
