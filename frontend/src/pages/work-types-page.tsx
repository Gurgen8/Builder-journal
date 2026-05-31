import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { WorkTypeFormModal } from '../features/work-type-form/work-type-form-modal';
import { useWorkTypes } from '../entities/work-type/api';
import { formatDate } from '../shared/utils/date';

export const WorkTypesPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const { data: workTypes = [], isLoading, isError, error, refetch } = useWorkTypes();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Filter list locally for premium responsive feel
  const filteredTypes = workTypes.filter((type) =>
    type.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', minWidth: 0 }}>
      {/* Header section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'text.primary' }}>
            Справочник видов строительных работ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Управляйте списком доступных технологических операций. Данные используются для заполнения журнала.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={() => setFormOpen(true)}
          sx={{
            py: 1.25,
            px: 3,
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(0, 102, 102, 0.25)',
            textTransform: 'none',
            alignSelf: { xs: 'stretch', sm: 'auto' },
            '&:hover': {
              boxShadow: '0 6px 20px 0 rgba(0, 102, 102, 0.35)',
            },
          }}
        >
          Добавить вид работ
        </Button>
      </Stack>

      {/* Local search input */}
      <Box sx={{ mb: 4, maxWidth: 480 }}>
        <TextField
          fullWidth
          placeholder="Поиск по справочнику..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading state indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size={40} thickness={4} />
          <Typography sx={{ ml: 2, fontWeight: 500, color: 'text.secondary' }}>
            Загрузка справочника...
          </Typography>
        </Box>
      )}

      {/* Error alert indicator */}
      {isError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Повторить запрос
            </Button>
          }
        >
          {error?.message || 'Не удалось связаться с сервером.'}
        </Alert>
      )}

      {/* Empty dictionary state overlay */}
      {!isLoading && !isError && filteredTypes.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 4,
            borderRadius: 4,
            border: '1px dashed',
            borderColor: 'divider',
            textAlign: 'center',
            bgcolor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'action.hover', color: 'text.secondary', mb: 2 }}>
            <LibraryBooksRoundedIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
            Справочник пуст
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
            {search ? 'Нет видов работ, соответствующих поисковому запросу.' : 'В справочнике пока нет доступных видов работ. Добавьте первый вид работ.'}
          </Typography>
        </Paper>
      )}

      {/* Responsive layout list of cards */}
      {!isLoading && !isError && filteredTypes.length > 0 && (
        <Grid container spacing={2.5}>
          {filteredTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      color: 'text.primary',
                      mb: 2,
                      fontSize: '1rem',
                      lineHeight: 1.4,
                      minHeight: '2.8rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {type.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1} sx={{ color: 'text.secondary' }}>
                    <CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      Добавлен: {formatDate(type.createdAt)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal form */}
      <WorkTypeFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
};
