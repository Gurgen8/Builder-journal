import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box } from '@mui/material';
import { useCreateWorkType } from '@/services/work-type-service';
import { useToast } from './shared/ToastProvider';
import { ApiError } from '@/types';
import { Modal } from './shared/Modal';
import { Input } from './shared/Input';
import { Button } from './shared/Button';

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
    <Modal
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="xs"
      title="Добавить вид работ"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate id="work-type-form">
        <Box sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Наименование вида работ"
                placeholder="Например, Облицовка фасада плитами"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSaving}
                autoFocus
              />
            )}
          />
        </Box>

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
            Добавить
          </Button>
        </Box>
      </form>
    </Modal>
  );
};
