import React, { useState } from 'react';
import { Box, Stack, Grid, Alert, IconButton } from '@mui/material';
import { TOKENS } from '@/constants/tokens';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { WorkTypeFormModal } from '@/components/work-type-form-modal';
import { useWorkTypes, useDeleteWorkType } from '@/services/work-type-service';
import { formatDate } from '@/utils/date';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Text } from '@/components/shared/Text';
import { Input } from '@/components/shared/Input';
import { EmptyState } from '@/components/shared/EmptyState';
import { Loader } from '@/components/shared/Loader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useToast } from '@/components/shared/ToastProvider';
import { useDebounce } from '@/utils/debounce';
import { ApiError } from '@/types';

export const WorkTypesScreen: React.FC = () => {
  const toast = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  const { data: workTypes = [], isLoading, isError, error, refetch } = useWorkTypes();
  const deleteMutation = useDeleteWorkType();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDeleteClick = (id: string) => {
    setTargetDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!targetDeleteId) return;

    deleteMutation.mutate(targetDeleteId, {
      onSuccess: () => {
        toast.showSuccess('Вид работ успешно удален');
        setDeleteConfirmOpen(false);
        setTargetDeleteId(null);
      },
      onError: (err: ApiError) => {
        toast.showError(err.message || 'Не удалось удалить вид работы');
        setDeleteConfirmOpen(false);
      },
    });
  };

  const filteredTypes = workTypes.filter((type) =>
    type.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const isDeleting = deleteMutation.isPending;

  return (
    <ScreenContainer>
      { }
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Text variant="h5" sx={{ fontWeight: 800 }}>
            Справочник видов строительных работ
          </Text>
          <Text variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Управляйте списком доступных технологических операций. Данные используются для заполнения журнала.
          </Text>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={() => setFormOpen(true)}
          hasShadow
          sx={{
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          Добавить вид работ
        </Button>
      </Stack>

      { }
      <Box sx={{ mb: 4, maxWidth: 480 }}>
        <Input
          placeholder="Поиск по справочнику..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornmentIcon icon={<SearchRoundedIcon sx={{ color: 'text.secondary' }} />} />
            ),
          }}
        />
      </Box>

      { }
      {isLoading && <Loader message="Загрузка справочника..." height={200} />}

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: TOKENS.borderRadius.large }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()} sx={{ p: 0.5, py: 0.25 }}>
              Повторить запрос
            </Button>
          }
        >
          {error?.message || 'Не удалось связаться с сервером.'}
        </Alert>
      )}

      {!isLoading && !isError && filteredTypes.length === 0 && (
        <EmptyState
          title="Справочник пуст"
          description={
            debouncedSearch
              ? 'Нет видов работ, соответствующих поисковому запросу.'
              : 'В справочнике пока нет доступных видов работ. Добавьте первый вид работ.'
          }
          icon={<LibraryBooksRoundedIcon sx={{ fontSize: 40 }} />}
        />
      )}

      {!isLoading && !isError && filteredTypes.length > 0 && (
        <Grid container spacing={2.5}>
          {filteredTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card hoverable sx={{ p: 3 }}>
                <Text
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 700,
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
                </Text>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Stack direction="row" alignItems="center" gap={1} sx={{ color: 'text.secondary' }}>
                    <CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />
                    <Text variant="caption" sx={{ fontWeight: 500, color: 'inherit' }}>
                      Добавлен: {formatDate(type.createdAt)}
                    </Text>
                  </Stack>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(type.id)}
                    sx={{
                      bgcolor: 'error.light',
                      color: 'error.main',
                      '&:hover': { bgcolor: 'error.main', color: 'error.contrastText' },
                    }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      { }
      <WorkTypeFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Удалить вид работ?"
        description="Вы собираетесь удалить этот вид работ. Если на него ссылаются какие-либо записи в журнале, удаление будет отклонено системой."
        confirmText="Удалить"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setTargetDeleteId(null);
        }}
      />
    </ScreenContainer>
  );
};

const InputAdornmentIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
      {icon}
    </Box>
  );
};
