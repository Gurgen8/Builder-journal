import React, { useState } from 'react';
import { Box, Button, Typography, Stack, Alert, AlertTitle } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { WorkLogsTable } from '../widgets/work-logs-table/work-logs-table';
import { WorkLogFilters } from '../features/work-log-filters/work-log-filters';
import { WorkLogFormModal } from '../features/work-log-form/work-log-form-modal';
import { ConfirmDialog } from '../shared/ui/confirm-dialog';
import { useWorkLogs, useDeleteWorkLog, WorkLogsQueryParams } from '../entities/work-log/api';
import { useToast } from '../shared/ui/toast-provider';
import { WorkLog, ApiError } from '../shared/types';

export const WorkLogsPage: React.FC = () => {
  const toast = useToast();
  
  // 1. Filter Query Parameters State
  const [filters, setFilters] = useState<WorkLogsQueryParams>({
    search: '',
    startDate: undefined,
    endDate: undefined,
    workTypeId: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // 2. Add / Edit Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [activeLog, setActiveLog] = useState<WorkLog | null>(null);

  // 3. Delete Confirmation Dialog States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  // 4. Server State Queries & Mutations
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
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', minWidth: 0 }}>
      {/* Page Header Actions */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'text.primary' }}>
            Журнал производства работ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Контролируйте объемы, исполнителей и даты выполнения технологических этапов на объекте.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={handleCreateClick}
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
          Внести запись
        </Button>
      </Stack>

      {/* Query Filter panel */}
      <WorkLogFilters filters={filters} onFiltersChange={setFilters} />

      {/* Database Error Alert banner */}
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
          <AlertTitle>Ошибка загрузки данных</AlertTitle>
          {error?.message || 'Не удалось связаться с сервером. Проверьте подключение к сети.'}
        </Alert>
      )}

      {/* Data Grid table widget */}
      <WorkLogsTable
        logs={logs}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Dynamic Creation / Modification form modal */}
      <WorkLogFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editLog={activeLog}
      />

      {/* Safety action deletion modal */}
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
    </Box>
  );
};
