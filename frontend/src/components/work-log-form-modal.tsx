import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  Box,
} from '@mui/material';
import { useWorkTypes } from '../services/work-type-service';
import { useCreateWorkLog, useUpdateWorkLog } from '../services/work-log-service';
import { useToast } from './shared/ToastProvider';
import { formatIsoDate } from '../utils/date';
import { WorkLog, ApiError } from '../types';
import { Modal } from './shared/Modal';
import { Input } from './shared/Input';
import { Button } from './shared/Button';
import { Text } from './shared/Text';
import { TOKENS } from '../constants/tokens';

export const workLogSchema = z.object({
  date: z.string().min(1, 'Укажите дату выполнения работ'),
  workTypeId: z.string().uuid('Выберите вид работ из списка'),
  volume: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number({
      required_error: 'Укажите объем выполненных работ',
      invalid_type_error: 'Объем должен быть числом'
    })
      .positive('Объем работ должен быть больше 0')
  ),
  unit: z.string().min(1, 'Укажите единицу измерения').max(10, 'Максимум 10 символов'),
  workerName: z.string()
    .trim()
    .min(2, 'ФИО должно содержать не менее 2 символов')
    .max(150, 'ФИО не должно превышать 150 символов'),
});

export type WorkLogFormValues = z.infer<typeof workLogSchema>;

interface WorkLogFormModalProps {
  open: boolean;
  onClose: () => void;
  editLog?: WorkLog | null;
}

const COMMON_UNITS = ['м²', 'м³', 'т', 'шт', 'м.п.'];

const selectStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: TOKENS.borderRadius.small,
  },
};

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
    <Modal
      open={open}
      onClose={isSaving ? undefined : onClose}
      title={isEdit ? 'Редактировать запись' : 'Добавить запись в журнал'}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate id="work-log-form">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Дата выполнения"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  disabled={isSaving}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="workerName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ФИО исполнителя"
                  placeholder="Иванов И.И."
                  required
                  error={!!errors.workerName}
                  helperText={errors.workerName?.message}
                  disabled={isSaving}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="workTypeId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.workTypeId} size="small" sx={selectStyles} disabled={isSaving || isLoadingTypes}>
                  <InputLabel id="work-type-select-label">Вид работ</InputLabel>
                  <Select
                    {...field}
                    labelId="work-type-select-label"
                    label="Вид работ"
                  >
                    {workTypes.length === 0 ? (
                      <MenuItem disabled value="">
                        <Text variant="body2" color="text.secondary">
                          {isLoadingTypes ? 'Загрузка списка...' : 'Список пуст. Добавьте виды работ в справочник.'}
                        </Text>
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

          <Grid item xs={12} sm={6}>
            <Controller
              name="volume"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  label="Объем работ"
                  type="number"
                  placeholder="Например, 25.5"
                  required
                  error={!!errors.volume}
                  helperText={errors.volume?.message}
                  disabled={isSaving}
                  inputProps={{ step: 'any', min: '0' }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.unit} size="small" sx={selectStyles} disabled={isSaving}>
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" disabled={isSaving}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            isLoading={isSaving}
          >
            {isEdit ? 'Сохранить изменения' : 'Добавить'}
          </Button>
        </Box>
      </form>
    </Modal>
  );
};
