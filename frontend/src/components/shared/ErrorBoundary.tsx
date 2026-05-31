import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { TOKENS } from '@/constants/tokens';
import { Card } from './Card';
import { Text } from './Text';
import { Button } from './Button';

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
          <Card
            sx={{
              p: 5,
              borderRadius: TOKENS.borderRadius.large,
              textAlign: 'center',
              boxShadow: TOKENS.shadows.errorCard,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ErrorOutlineRoundedIcon color="error" sx={{ fontSize: 60 }} />
            </Box>
            <Text variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Что-то пошло не так
            </Text>
            <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Произошла непредвиденная ошибка при отрисовке интерфейса. Пожалуйста, перезапустите приложение или обратитесь к системному администратору.
            </Text>
            {this.state.error && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: TOKENS.borderRadius.small,
                  textAlign: 'left',
                  mb: 4,
                  overflowX: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <TypographyMonospace text={this.state.error.toString()} />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{ px: 4, py: 1 }}
            >
              Вернуться на главную
            </Button>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

const TypographyMonospace: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        fontFamily: 'monospace',
        color: 'error.main',
        fontSize: '0.825rem',
        overflowX: 'auto',
      }}
    >
      {text}
    </Box>
  );
};
