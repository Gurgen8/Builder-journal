import React, { useState } from 'react';
import { Box, Stack, Alert, AlertTitle } from '@mui/material';
import { TOKENS } from '@/constants/tokens';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { WorkLogsTable } from '@/components/work-logs-table';
import { WorkLogFilters } from '@/components/work-log-filters';
import { WorkLogFormModal } from '@/components/work-log-form-modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useWorkLogs, useDeleteWorkLog, WorkLogsQueryParams } from '@/services/work-log-service';
import { useToast } from '@/components/shared/ToastProvider';
import { WorkLog, ApiError } from '@/types';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { Button } from '@/components/shared/Button';
import { Text } from '@/components/shared/Text';

export const WorkLogsScreen: React.FC = () => {
  const toast = useToast();

  const [filters, setFilters] = useState<WorkLogsQueryParams>({
    search: '',
    startDate: undefined,
    endDate: undefined,
    workTypeId: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [formOpen, setFormOpen] = useState(false);
  const [activeLog, setActiveLog] = useState<WorkLog | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  const { data: logs = [], isLoading, isError, error, refetch } = useWorkLogs(filters);
  const deleteMutation = useDeleteWorkLog();

  const handleEditClick = (log: WorkLog) => {
    setActiveLog(log);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setActiveLog(null);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTargetDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!targetDeleteId) return;

    deleteMutation.mutate(targetDeleteId, {
      onSuccess: () => {
        toast.showSuccess('Запись успешно удалена из журнала');
        setDeleteConfirmOpen(false);
        setTargetDeleteId(null);
      },
      onError: (err: ApiError) => {
        toast.showError(err.message || 'Не удалось удалить запись');
        setDeleteConfirmOpen(false);
      },
    });
  };

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
            Журнал производства работ
          </Text>
          <Text variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Контролируйте объемы, исполнителей и даты выполнения технологических этапов на объекте.
          </Text>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={handleCreateClick}
          hasShadow
          sx={{
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          Внести запись
        </Button>
      </Stack>

      { }
      <WorkLogFilters filters={filters} onFiltersChange={setFilters} />
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
          <AlertTitle>Ошибка загрузки данных</AlertTitle>
          {error?.message || 'Не удалось связаться с сервером. Проверьте подключение к сети.'}
        </Alert>
      )}

      { }
      <WorkLogsTable
        logs={logs}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <WorkLogFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editLog={activeLog}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Удалить запись?"
        description="Вы собираетесь безвозвратно удалить эту запись из строительного журнала. Отменить это действие будет невозможно."
        confirmText="Удалить запись"
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
