import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';
import { WorkType, ApiError } from '@/types';

export const workTypeKeys = {
  all: ['work-types'] as const,
};

export const useWorkTypes = () => {
  return useQuery<WorkType[]>({
    queryKey: workTypeKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<WorkType[]>('/work-types');
      return response.data;
    },
  });
};

export const useCreateWorkType = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkType, ApiError, { name: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<WorkType>('/work-types', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workTypeKeys.all });
    },
  });
};
