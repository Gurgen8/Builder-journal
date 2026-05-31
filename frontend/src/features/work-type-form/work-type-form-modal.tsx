import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useCreateWorkType } from '../../entities/work-type/api';
import { useToast } from '../../shared/ui/toast-provider';
import { ApiError } from '../../shared/types';

const workTypeFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Наименование должно содержать не менее 2 символов')
    .max(100, 'Наименование не должно превышать 100 символов'),
});

type WorkTypeFormValues = z.infer<typeof workTypeFormSchema>;

interface WorkTypeFormModalProps {
  open: boolean;
  onClose: () => void;
}

export const WorkTypeFormModal: React.FC<WorkTypeFormModalProps> = ({ open, onClose }) => {
  const toast = useToast();
  const createMutation = useCreateWorkType();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<WorkTypeFormValues>({
    resolver: zodResolver(workTypeFormSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when modal is closed/opened
  React.useEffect(() => {
    if (!open) {
      reset({ name: '' });
    }
  }, [open, reset]);

  const onSubmit = (data: WorkTypeFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast.showSuccess(`Вид работ "${res.name}" успешно добавлен`);
        onClose();
        reset();
      },
      onError: (err: ApiError) => {
        const errMsg = err.message || 'Не удалось добавить вид работ';
        toast.showError(errMsg);
        if (errMsg.includes('уже существует')) {
          setError('name', { type: 'server', message: 'Вид работ с таким названием уже существует' });
        }
      },
    });
  };

  const isSaving = createMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
        Добавить вид работ
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Наименование вида работ"
                  placeholder="Например, Облицовка фасада плитами"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSaving}
                  autoFocus
                />
              )}
            />
          </Box>
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
            {isSaving ? 'Сохранение...' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
