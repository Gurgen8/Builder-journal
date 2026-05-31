import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { workLogSchema, WorkLogFormValues } from './schema';
import { useWorkTypes } from '../../entities/work-type/api';
import { useCreateWorkLog, useUpdateWorkLog } from '../../entities/work-log/api';
import { useToast } from '../../shared/ui/toast-provider';
import { formatIsoDate } from '../../shared/utils/date';
import { WorkLog, ApiError } from '../../shared/types';

interface WorkLogFormModalProps {
  open: boolean;
  onClose: () => void;
  editLog?: WorkLog | null;
}

const COMMON_UNITS = ['м²', 'м³', 'т', 'шт', 'м.п.'];

export const WorkLogFormModal: React.FC<WorkLogFormModalProps> = ({ open, onClose, editLog }) => {
  const toast = useToast();
  const { data: workTypes = [], isLoading: isLoadingTypes } = useWorkTypes();
  const createMutation = useCreateWorkLog();
  const updateMutation = useUpdateWorkLog();

  const isEdit = !!editLog;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<WorkLogFormValues>({
    resolver: zodResolver(workLogSchema),
    defaultValues: {
      date: formatIsoDate(new Date()),
      workTypeId: '',
      volume: undefined,
      unit: 'м²',
      workerName: '',
    },
  });

  // Sync initial values when editing or when opening modal
  useEffect(() => {
    if (open) {
      if (editLog) {
        reset({
          date: formatIsoDate(editLog.date),
          workTypeId: editLog.workTypeId,
          volume: editLog.volume,
          unit: editLog.unit,
          workerName: editLog.workerName,
        });
      } else {
        reset({
          date: formatIsoDate(new Date()),
          workTypeId: '',
          volume: undefined,
          unit: 'м²',
          workerName: '',
        });
      }
    }
  }, [open, editLog, reset]);

  const onSubmit = (data: WorkLogFormValues) => {
    const mutationOptions = {
      onSuccess: () => {
        toast.showSuccess(isEdit ? 'Запись успешно обновлена' : 'Запись успешно добавлена');
        onClose();
        reset();
      },
      onError: (err: ApiError) => {
        const errMsg = err.message || 'Не удалось сохранить запись';
        toast.showError(errMsg);
        
        // If there are detailed validation errors from the backend, map them to form fields
        if (Array.isArray(err.errors)) {
          err.errors.forEach((message: string) => {
            if (message.toLowerCase().includes('объем')) {
              setError('volume', { type: 'server', message });
            } else if (message.toLowerCase().includes('фио')) {
              setError('workerName', { type: 'server', message });
            } else if (message.toLowerCase().includes('дата')) {
              setError('date', { type: 'server', message });
            } else if (message.toLowerCase().includes('единица')) {
              setError('unit', { type: 'server', message });
            }
          });
        }
      },
    };

    if (isEdit && editLog) {
      updateMutation.mutate(
        {
          id: editLog.id,
          payload: data,
        },
        mutationOptions
      );
    } else {
      createMutation.mutate(data, mutationOptions);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
        {isEdit ? 'Редактировать запись' : 'Добавить запись в журнал'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={3}>
            {/* 1. Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Дата выполнения"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    disabled={isSaving}
                  />
                )}
              />
            </Grid>

            {/* 2. Worker Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="workerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ФИО исполнителя"
                    placeholder="Иванов И.И."
                    fullWidth
                    required
                    error={!!errors.workerName}
                    helperText={errors.workerName?.message}
                    disabled={isSaving}
                  />
                )}
              />
            </Grid>

            {/* 3. Work Type Selection */}
            <Grid item xs={12}>
              <Controller
                name="workTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.workTypeId} disabled={isSaving || isLoadingTypes}>
                    <InputLabel id="work-type-select-label">Вид работ</InputLabel>
                    <Select
                      {...field}
                      labelId="work-type-select-label"
                      label="Вид работ"
                    >
                      {workTypes.length === 0 ? (
                        <MenuItem disabled value="">
                          <Typography variant="body2" color="text.secondary">
                            {isLoadingTypes ? 'Загрузка списка...' : 'Список пуст. Добавьте виды работ в справочник.'}
                          </Typography>
                        </MenuItem>
                      ) : (
                        workTypes.map((type) => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.workTypeId && <FormHelperText>{errors.workTypeId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* 4. Volume of Work */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="volume"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    label="Объем работ"
                    type="number"
                    placeholder="Например, 25.5"
                    fullWidth
                    required
                    error={!!errors.volume}
                    helperText={errors.volume?.message}
                    disabled={isSaving}
                    inputProps={{ step: 'any', min: '0' }}
                  />
                )}
              />
            </Grid>

            {/* 5. Unit Selection */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.unit} disabled={isSaving}>
                    <InputLabel id="unit-select-label">Единица измерения</InputLabel>
                    <Select
                      {...field}
                      labelId="unit-select-label"
                      label="Единица измерения"
                    >
                      {COMMON_UNITS.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.unit && <FormHelperText>{errors.unit.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" disabled={isSaving} sx={{ borderRadius: 2 }}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSaving}
            sx={{
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {isSaving ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
