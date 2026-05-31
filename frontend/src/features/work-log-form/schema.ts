import { z } from 'zod';

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
export type EditWorkLogPayload = WorkLogFormValues & { id: string };
