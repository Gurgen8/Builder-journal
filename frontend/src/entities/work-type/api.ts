import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { WorkType, ApiError } from '../../shared/types';

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
      // Invalidate cache to trigger re-fetches across forms and lists
      queryClient.invalidateQueries({ queryKey: workTypeKeys.all });
    },
  });
};
